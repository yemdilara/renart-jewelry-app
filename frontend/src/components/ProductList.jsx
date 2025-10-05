// tüm ürünleri carousel da gösteren component

import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';// react slick kullandım carousel için
import ProductCard from './ProductCard';
import { urunleriGetir } from '../services/api';

// carousel css lerini import ettim yoksa slider çalışmaz
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function ProductList() {
  
  // state ler - her birini ayrı tanımladım daha anlaşılır olsun diye
  const [urunler, setUrunler] = useState([]); //ürün listesi
  const [yukleniyor, setYukleniyor] = useState(true); //loading durumu
  const [hata, setHata] = useState(null); //hata mesajı
  const [altinFiyati, setAltinFiyati] = useState(null); //güncel altın fiyatı
  
  // component ilk yüklendiğinde çalışacak - useeffect hook u
  useEffect(() => {
    console.log('Component yüklendi, ürünleri çekiyorum');
    urunleriYukle();
  }, []); // [] = sadece ilk render da çalış
  
  // backend den ürünleri çeken fonksiyon
  const urunleriYukle = async () => {
    try {
      console.log('Ürünler yükleniyor...');
      setYukleniyor(true);
      setHata(null);
      
      // api fonksiyonunu çağır
      const veri = await urunleriGetir();
      
      // state leri güncelle
      setUrunler(veri.products);
      setAltinFiyati(veri.goldPrice);
      
      console.log('Başarılı! Yüklenen ürün sayısı:', veri.count);
      
    } catch (err) {
      console.error('Ürünler yüklenirken hata:', err);
      setHata(err.message);
    } finally {
      setYukleniyor(false); //her türlü loading u kapat
    }
  };
  
  // carousel ayarları - brief e göre ok tuşları + swipe olacak
  const carouselAyarlari = {
    dots: true,            // alttaki noktalar
    infinite: true,        // sonsuz döngü
    speed: 500,            // animasyon hızı ms cinsinden
    slidesToShow: 4,       // aynı anda 4 ürün göster
    slidesToScroll: 1,     // her tıklamada 1 ürün kaydır
    swipeToSlide: true,    // parmakla kaydırma aktif
    arrows: true,          // sağ sol oklar olsun
    
    // responsive - ekran küçüldükçe daha az ürün göster
    responsive: [
      {
        breakpoint: 1280,  // büyük ekran
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 1024,  // tablet
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 640,   // mobil
        settings: {
          slidesToShow: 1,
          arrows: true     // mobilde de oklar olsun
        }
      }
    ]
  };
  
  // loading durumu - ürünler yüklenirken
  if (yukleniyor) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="spinner mb-4"></div>
        <p className="text-gray-600">Ürünler yükleniyor...</p>
      </div>
    );
  }
  
  // hata durumu - backend e bağlanmadı vs
  if (hata) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-800 mb-2">
            Hata Oluştu
          </h2>
          <p className="text-red-600 mb-4">
            {hata}
          </p>
          {/* tekrar dene butonu */}
          <button
            onClick={() => {
              console.log('Tekrar deneniyor...');
              urunleriYukle();
            }}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }
  
  // ürün yoksa
  if (urunler.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-xl">Hiç ürün bulunamadı.</p>
      </div>
    );
  }
  
  // ana görünüm - carousel ile ürünleri göster
  return (
    <div className="container mx-auto px-4 py-12">
      
      {/* başlık - avenir book 45px (tasarımdan) */}
      <div className="text-center mb-12">
        <h1 className="title-main text-gray-900 mb-2">
          Product List
        </h1>
        
        {/* altın fiyatını göster */}
        {altinFiyati && (
          <p className="text-sm text-gray-500">
            Güncel Altın Fiyatı: ${altinFiyati.toFixed(2)}/gram
          </p>
        )}
      </div>
      
      {/* carousel - react-slick */}
      <div className="max-w-7xl mx-auto px-12">
        <Slider {...carouselAyarlari}>
          {urunler.map((urun, index) => {
            console.log('Ürün render ediliyor:', urun.name); //hangi ürün gösteriliyor
            return (
              <div key={index}>
                <ProductCard urun={urun} />
              </div>
            );
          })}
        </Slider>
      </div>
      
      {/* altta bilgi göster */}
      <div className="text-center mt-8 text-sm text-gray-500">
        Toplam {urunler.length} ürün gösteriliyor
      </div>
      
    </div>
  );
}

export default ProductList;