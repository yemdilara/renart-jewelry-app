import React, { useState } from 'react';
import ColorPicker from './ColorPicker';// tek bir ürünü gösteren kart

function ProductCard({ urun }) {// içinde resim, isim, fiyat, renk seçici ve yıldızlar var
  
  const [secilenRenk, setSecilenRenk] = useState('yellow'); //başlangıca yellow gold u seçili koydum
  
  
  const [gorselYukleniyor, setGorselYukleniyor] = useState(true);// görsel yüklenirken bekletme
 
  const yildizlariCiz = (puan) => {
    const yildizlar = []; // 4.4 gelirse 4 dolu 1 boş yıldız çizecek
    const doluYildiz = Math.floor(puan); //4.3 -> 4
    
    // 5 yıldız çiz
    for (let i = 0; i < 5; i++) {
      if (i < doluYildiz) {
        yildizlar.push(
          <span key={i} className="text-yellow-500 text-base">★</span>
        );
      } else {// boş yıldız
        yildizlar.push(
          <span key={i} className="text-gray-300 text-base">★</span>
        );
      }
    }
    
    return yildizlar;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mx-2 hover:shadow-lg transition-shadow">
      
      {/* ürün görseli bölümü */}
      <div className="relative aspect-square mb-3 bg-gray-100 rounded-lg overflow-hidden">
        
        {/* görsel yüklenene kadar spinner */}
        {gorselYukleniyor && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="spinner"></div>
          </div>
        )}
        
        {/* ürün resmi seçilen renge göre değişiyor */}
        <img
          src={urun.images[secilenRenk]}
          alt={urun.name}
          className={`w-full h-full object-cover transition-opacity duration-300 
            ${gorselYukleniyor ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => {
            console.log('Görsel yüklendi:', urun.name, secilenRenk);
            setGorselYukleniyor(false);
          }}
          onError={() => {
            console.error('Görsel yüklenemedi:', urun.images[secilenRenk]);
            setGorselYukleniyor(false);
          }}
        />
      </div>
      
      {/* ürün bilgileri */}
      <div className="space-y-2">
        
        {/* ürün ismi - avenir book 14px (tasarımdan) */}
        <h3 className="product-title text-gray-800">
          {urun.name}
        </h3>
        
        {/* fiyat - avenir book 12px */}
        <p className="product-price text-gray-900">
          ${urun.price.toFixed(2)} USD
        </p>
        
        {/* renk seçici component i */}
        <ColorPicker
          renkler={urun.images}
          secilenRenk={secilenRenk}
          renkDegistir={(yeniRenk) => {
            setSecilenRenk(yeniRenk);
            setGorselYukleniyor(true); //yeni görseli yüklerken spinner göster
          }}
        />
        
        {/* yıldızlar ve puan - montserrat medium 15px */}
        <div className="flex items-center gap-1 pt-1">
          <div className="flex">
            {yildizlariCiz(urun.popularityRating)}
          </div>
          <span className="rating-text text-gray-700 ml-1">
            {urun.popularityRating.toFixed(1)}/5
          </span>
        </div>
        
      </div>
    </div>
  );
}

export default ProductCard;