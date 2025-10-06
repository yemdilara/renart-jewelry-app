import React, { useState } from 'react';

function ProductCard({ urun }) {
  const [renk, setRenk] = useState('yellow');//başlangıç rengi
  
  return (
    <div style={{ 
      background: 'white', 
      borderRadius: '10px', 
      padding: '15px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      
      <img //resim seçilen renge göre değişiyo
        src={urun.images[renk]}
        alt={urun.name}
        style={{ 
          width: '100%',
          height: 'auto',
          borderRadius: '8px',
          marginBottom: '12px',
          display: 'block'
        }}
      />
      
      <h3 style={{   //ürün ismi fotoda verilene göre Montserrat-Medium-15px 
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 500,
        fontSize: '15px',
        color: '#1f2937',
        marginBottom: '6px'
      }}>
        {urun.name}
      </h3>
      
      <p style={{  //fiyat, Montserrat-Regular-15px
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 400,
        fontSize: '15px',
        color: '#111827',
        marginBottom: '10px'
      }}>
        ${urun.price.toFixed(2)} USD
      </p>
      
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
        <button // renk butonları
          onClick={() => setRenk('yellow')}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%', // yuvarlak yapiyo
            border: renk === 'yellow' ? '3px solid #374151' : '2px solid #d1d5db',
            background: '#E6CA97',
            cursor: 'pointer',
            padding: 0
          }}
        />
        <button
          onClick={() => setRenk('white')}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: renk === 'white' ? '3px solid #374151' : '2px solid #d1d5db',
            background: '#D9D9D9',
            cursor: 'pointer',
            padding: 0
          }}
        />
        <button
          onClick={() => setRenk('rose')}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: renk === 'rose' ? '3px solid #374151' : '2px solid #d1d5db',
            background: '#E1A4A9',
            cursor: 'pointer',
            padding: 0
          }}
        />
        <span style={{ //seçili rengin ismini gösteriyo  Avenir-Book-12px
          fontFamily: 'Avenir, sans-serif',
          fontSize: '12px',
          color: '#374151',
          marginLeft: '4px'
        }}>
          {renk === 'yellow' && 'Yellow Gold'}
          {renk === 'white' && 'White Gold'}
          {renk === 'rose' && 'Rose Gold'}
        </span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {[...Array(5)].map((_, i) => ( //yıldız ve puan
          <span key={i} style={{ 
            color: i < Math.floor(urun.popularityRating) ? '#fbbf24' : '#d1d5db',
            fontSize: '14px'
          }}>★</span>
        ))}
        <span style={{ //puan yazısı Avenir-Book-14px
          fontFamily: 'Avenir, sans-serif',
          fontSize: '14px',
          color: '#374151',
          marginLeft: '4px'
        }}>
          {urun.popularityRating.toFixed(1)}/5
        </span>
      </div>
      
    </div>
  );
}

export default ProductCard;