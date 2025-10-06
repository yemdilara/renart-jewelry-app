// Backend ile konuşmak için kullandığım api fonksiyonları
// axios import ettim http istekleri için

import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000'; //backend adresi, production da render linki olacak

// ürünleri çeken fonksiyon - async çünkü backend den cevap bekliyor
export const urunleriGetir = async () => {
  
  try {
    console.log('Backend e istek atıyorum:', BACKEND_URL + '/api/products');
    
    const cevap = await axios.get(BACKEND_URL + '/api/products'); //get isteği attım
    
    console.log('Backend den cevap geldi:'); //ne geldi kontrol
    console.log('Başarılı mı:', cevap.data.success);
    console.log('Ürün sayısı:', cevap.data.count);
    console.log('Altın fiyatı:', cevap.data.goldPrice);
    
    return cevap.data; //tüm response u döndürüyorum
    
  } catch (hata) {
    console.error('API hatası:', hata);
    
    // hata mesajı oluştururken kontrol ettim - nereden kaynaklı
    if (hata.response) {
      // backend cevap verdi ama hata kodu döndü (500, 404 vs)
      throw new Error('Sunucu hatası: ' + hata.response.status);
    } else if (hata.request) {
      // backend e hiç ulaşamadık - muhtemelen çalışmıyor
      throw new Error('Backend e bağlanılamıyor. Backend çalışıyor mu kontrol et.');
    } else {
      // başka bi hata
      throw new Error('Beklenmeyen hata: ' + hata.message);
    }
  }
};