import React, { useState, useEffect } from 'react';
import Slider from 'react-slick'; // carousel kütüphanes
import ProductCard from './ProductCard';
import { urunleriGetir } from '../services/api';

function ProductList() {
  const [urunler, setUrunler] = useState([]);// ürün listesi
  const [yukleniyor, setYukleniyor] = useState(true);// loading durumu
  
  useEffect(() => {  //eğer sayfa açılırsa çalışır
    const veriCek = async () => {
      try {
        const cevap = await urunleriGetir();
        setUrunler(cevap.products);
      } catch (err) {
        console.error(err);
      }
      setYukleniyor(false);
    };
    veriCek();
  }, []); // [] = sadece ilk açılışta çalış
  
  if (yukleniyor) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>Yükleniyor...</div>;
  }
  
  const ayarlar = { //carousel ayarları
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true, // sağ sol okları. rengini değiştir
    responsive: [  // ekran küçüldükçe daha az ürün göster
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } }
    ]
  };
  
  return (
    <div style={{ padding: '50px 20px' }}>
      <h1 style={{ //başlık Avenir-Book-45px
        fontFamily: 'Avenir, sans-serif',
        fontSize: '45px',
        textAlign: 'center',
        marginBottom: '60px',
        color: '#111827'
      }}>
        Product List
      </h1>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 70px' }}>
        <Slider {...ayarlar}>  
          {urunler.map((urun, i) => (//her ürün için bir kart 
            <div key={i} style={{ padding: '0 10px' }}>
              <ProductCard urun={urun} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default ProductList;