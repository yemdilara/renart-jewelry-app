const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 5000;

app.use(cors());

let altinCache = null;
let cacheSaat = null;

async function altinFiyatGetir() {
  
  const simdi = Date.now();
  const onDakika = 10 * 60 * 1000;
  
 
  if (altinCache && cacheSaat && (simdi - cacheSaat < onDakika)) { // cache varsa ve yeniyse(max 10 dk) onu kullan
    return altinCache;
  }

  try { // gold api dene
    const res = await axios.get('https://www.goldapi.io/api/XAU/USD', {
      headers: { 'x-access-token': 'goldapi-1ha616smgdrhhqd-io' }
    });
    
    if (res.data && res.data.price_gram_24k) {
      altinCache = res.data.price_gram_24k;
      cacheSaat = Date.now();
      return altinCache;
    }
  } catch (err) {
    console.log('goldapi çalışmadı');
  }

 
  try { // diğer api olmazsa bunu dene
    const res = await axios.get('https://api.metalpriceapi.com/v1/latest', {
      params: {
        api_key: '82d720a2d4fc714ddd48802d065acb50',
        base: 'USD',
        currencies: 'XAU'
      }
    });
    
    if (res.data && res.data.rates && res.data.rates.XAU) {
      const xauPerUsd = res.data.rates.XAU;
      const usdPerOns = 1 / xauPerUsd;
      const usdPerGram = usdPerOns / 31.1034768;
      
      altinCache = usdPerGram;
      cacheSaat = Date.now();
      return altinCache;
    }
  } catch (err) {
    console.log('metalprice çalışmadı');
  }
  
  // ikisi de olmazsa sabiti getir
  return 124.96;
}

app.get('/api/products', async (req, res) => {//ürünler ve bilgileri
  try {
    const dosya = path.join(__dirname, 'data', 'products.json');
    const icerik = fs.readFileSync(dosya, 'utf8');
    let urunler = JSON.parse(icerik);
    
    const altinFiyat = await altinFiyatGetir();
    
    urunler = urunler.map(u => {
      const fiyat = (u.popularityScore + 1) * u.weight * altinFiyat;
      const puan = u.popularityScore * 5;
      
      return {
        name: u.name,
        popularityScore: u.popularityScore,
        weight: u.weight,
        images: u.images,
        price: parseFloat(fiyat.toFixed(2)),//tofixed virgülden sonraki 2 basamak alıp stringe çeviriyo
        popularityRating: parseFloat(puan.toFixed(1)),// parsefloat içine string yazılır çevirir
        goldPriceUsed: altinFiyat
      };
    });

    res.json({
      success: true,
      goldPrice: parseFloat(altinFiyat.toFixed(2)),
      count: urunler.length,
      products: urunler
    });
    
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Hata oluştu',
      error: err.message
    });
  }
});

app.get('/api/health', (req, res) => {// kontrol
  res.json({
    status: 'OK',
    message: 'Backend çalışıyor'
  });
});

app.listen(PORT, () => {
  console.log('Server çalışıyor: http://localhost:' + PORT);
});