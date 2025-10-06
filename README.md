Canlı Link: https://renart-jewelry-app-eight.vercel.app/

Ürün listeleme uygulaması:

Backend (Mock API) JSON’dan ürün verisi sunar ve altın fiyatına göre dinamik fiyat hesaplar.
Frontend verilen tasarıma yakın biçimde ürünleri listeler, renk seçici, popülariteyi 5’lik skora çevirme (1 ondalık) ve ok + swipe ile çalışan carousel içerir.
(Bonus) Fiyat aralığı ve popülarite ile filtreleme.

Özellikler

Dinamik fiyat: Price = (popularityScore + 1) * weight * goldPrice (USD/gr)
Gerçek zamanlı altın fiyatı: dış kaynaktan çekilir (ENV ile yapılandırılır)
Renk seçici: 3 renk için 3 görüntü
Popülarite skoru: % popularityScore → /5 (örn. %82 → 4.1/5)
Carousel: oklarla ve swipe (masaüstü & mobil)
Filtreleme (Ops.): priceMin, priceMax, popMin, popMax 
