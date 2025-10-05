import axios from 'axios';//http istekleri için axios

const BACKEND_URL = (import.meta.env?.VITE_API_BASE_URL) || 'http://localhost:5000'; //production da render linki olacak


export const urunleriGetir = async () => {//backend den cevap bekliyor async
  
  try {
    
    console.log('Backend e istek atıyorum:', BACKEND_URL + '/api/products');
    
    const cevap = await axios.get(BACKEND_URL + '/api/products');
    
    console.log('Backend den cevap geldi:');
    console.log('Başarılı mı:', cevap.data.success);
    console.log('Ürün sayısı:', cevap.data.count);
    console.log('Altın fiyatı:', cevap.data.goldPrice);
    
    return cevap.data; //tüm response u döndürüyorum
    
  } catch (hata) {
    console.error('API hatası:', hata);
    
    if (hata.response) {// hata mesajı oluştururken kontrol ettim - nereden kaynaklı
      
      throw new Error('Sunucu hatası: ' + hata.response.status);// backend cevap verdi hata koduyla
    } else if (hata.request) { //muhtemelen çalışmıyor
      throw new Error('Backend e bağlanılamıyor. Backend çalışıyor mu kontrol et.');
    } else { // başka bi hata
      throw new Error('Beklenmeyen hata: ' + hata.message);
    }
  }
};