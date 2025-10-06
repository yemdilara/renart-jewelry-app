import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_API_URL || 
  (window.location.hostname === 'localhost' 
    ? 'http://localhost:5000'
    : 'https://renart-backend-kkep.onrender.com');
 /*backend adresi, production da render linki olacak

ürünleri çeken fonksiyon - async çünkü backend den cevap bekliyor*/
export const urunleriGetir = async () => {
  
  try {
    console.log('Backend e istek atıyorum:', BACKEND_URL + '/api/products');
    
    const cevap = await axios.get(BACKEND_URL + '/api/products'); 
    
    console.log('Backend den cevap geldi:'); 
    console.log('Başarılı mı:', cevap.data.success);
    console.log('Ürün sayısı:', cevap.data.count);
    console.log('Altın fiyatı:', cevap.data.goldPrice);
    
    return cevap.data; 
    
  } catch (hata) {
    console.error('API hatası:', hata);
    
    /*hata mesajı oluştururken kontrol ettim - nereden kaynaklı*/
    if (hata.response) {

      throw new Error('Sunucu hatası: ' + hata.response.status);
    } else if (hata.request) {
    
      throw new Error('Backend e bağlanılamıyor. Backend çalışıyor mu kontrol et.');
    } else {
      
      throw new Error('Beklenmeyen hata: ' + hata.message);
    }
  }
};