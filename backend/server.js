const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 5000;

app.use(cors());//cors açık olmalı yoksa frontend bağlanamıyor

let altinFiyatiCache = null;//altın fiyatını cache liyoruz her istekte api ye gitmemek için
let sonGuncellemeSaati = null;

async function getAltinFiyati() {
  
  const simdi = Date.now();
  const onDakika = 10 * 60 * 1000;// cache deki veri 10 dakikadan yeniyse cacheden dön
  
  if (altinFiyatiCache && sonGuncellemeSaati && (simdi - sonGuncellemeSaati < onDakika)) {
    console.log('Cache\'den alındı:', altinFiyatiCache);
    return altinFiyatiCache;
  }

  try {
    console.log('GoldAPI deneniyor...');// bu api direkt gram fiyatı veriyor
    
    const cevap = await axios.get('https://www.goldapi.io/api/XAU/USD', {
      headers: {
        'x-access-token': 'goldapi-1ha616smgdrhhqd-io'
      }
    });
    
    
    if (cevap.data && cevap.data.price_gram_24k) {
      const gramFiyati = cevap.data.price_gram_24k;
      altinFiyatiCache = gramFiyati; // cache e kaydet
      sonGuncellemeSaati = Date.now();
      
      console.log('GoldAPI başarılı:', gramFiyati.toFixed(2), 'USD/gram');
      return gramFiyati;
    }
    
  } catch (hata) {
    console.log('GoldAPI da çalışmadı:', hata.message);
  }

  
  try {// o çalışmazsa bu api yi dener
    console.log('MetalPriceAPI deneniyor...');
    
    const cevap = await axios.get('https://api.metalpriceapi.com/v1/latest', 
        {
      params: {
        api_key: '82d720a2d4fc714ddd48802d065acb50',
        base: 'USD',  //bu api nin base i usd olduğu için 1/sonuç diyeceğiz
        currencies: 'XAU' //ons
      }
    });
    
    if (cevap.data && cevap.data.rates && cevap.data.rates.XAU) {
       const xauPerUsd = cevap.data.rates.XAU;  //usd ons cinsinden
       const usdPerOunce = 1 / xauPerUsd; // ters çevirdik
       const usdPerGram = usdPerOunce / 31.1034768; // grama çevirdik
      
      console.log('Hesaplama adımları:');
      console.log(' - XAU per USD:', xauPerUsd);
      console.log(' - USD per ounce:', usdPerOunce.toFixed(2));
      console.log(' - USD per gram:', usdPerGram.toFixed(2));
      
      
      altinFiyatiCache = usdPerGram; //cache e kayıt
      sonGuncellemeSaati = Date.now();
      
      console.log('✅ MetalPriceAPI başarılı:', usdPerGram.toFixed(2), 'USD/gram');
      return usdPerGram;
    }

  } catch (hata) {
    console.log('MetalPriceAPI çalışmadı:', hata.message);
  }
  
  
  console.log('API\'ler çalışmıyor, varsayılan $124.96/gram kullanılıyor');
  return 124.96;//ikisi de olmazsa sabiti kullanıcak
}

app.get('/api/products', async (req, res) => { //ana endpoint 
  
  try { // hazır verilen json dosyasını okuyo
    const dosyaYolu = path.join(__dirname, 'data', 'products.json');
    const dosyaIcerigi = fs.readFileSync(dosyaYolu, 'utf8');
    let urunler = JSON.parse(dosyaIcerigi);
    
    console.log('JSON okundu, ürün sayısı:', urunler.length);
    
    const altinFiyati = await getAltinFiyati();//anlık altın fiyatı çekilecek
    
    
    urunler = urunler.map(urun => {//her ürün için fiyat-puan hesabı

      const hesaplananFiyat = (urun.popularityScore + 1) * urun.weight * altinFiyati; //+1 in sebebi sonuç 0 gelmesin diye
      const popularitePuani = urun.popularityScore * 5; //popülerlik puanı 5 üzerinden 
      
      return {
        name: urun.name, // yeni fieldları ekledik
        popularityScore: urun.popularityScore,
        weight: urun.weight,
        images: urun.images,
        
        price: parseFloat(hesaplananFiyat.toFixed(2)), //tofixed virgülden sonra 2 basamak al, parsefloat(string) res döndür
        popularityRating: parseFloat(popularitePuani.toFixed(1)),
        goldPriceUsed: altinFiyati 
      };
    });

    res.json({ 
      success: true,
      goldPrice: parseFloat(altinFiyati.toFixed(2)),
      count: urunler.length,
      products: urunler
    });
    
  } catch (hata) {
    console.error('Hata oluştu:', hata);
    res.status(500).json({
      success: false,
      message: 'Bir şeyler ters gitti',
      error: hata.message
    });
  }
});

app.get('/api/health', (req, res) => { // backend kontrol
  res.json({
    status: 'OK',
    message: 'Backend çalışıyor',
    zaman: new Date().toISOString()
  });
});


app.listen(PORT, () => {
  console.log('===================================');
  console.log('Server çalışıyor!');
  console.log('URL: http://localhost:' + PORT);
  console.log('Endpoint: http://localhost:' + PORT + '/api/products');
  console.log('===================================');
});