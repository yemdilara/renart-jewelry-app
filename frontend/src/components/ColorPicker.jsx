import React from 'react';

// tasarımdan aldığım hex kodları
const renkBilgileri = {
  yellow: {
    isim: 'Yellow Gold',
    hexKod: '#E6CA97' //tasarımda verildi
  },
  white: {
    isim: 'White Gold',
    hexKod: '#D9D9D9'
  },
  rose: {
    isim: 'Rose Gold',
    hexKod: '#E1A4A9'
  }
};

function ColorPicker({ renkler, secilenRenk, renkDegistir }) {
  
  return (
    <div className="flex items-center gap-2 my-3">
      
      {/* renk butonlarını oluştur */}
      <div className="flex gap-2">
        {Object.keys(renkler).map((renkKey) => { //renkler objesi içinde dön
          
          const seciliMi = secilenRenk === renkKey; //bu renk seçili mi kontrol
          const bilgi = renkBilgileri[renkKey]; //renk bilgisini al
          
          return (
            <button
              key={renkKey}
              onClick={() => {
                console.log('Renk değişti:', renkKey); //hangi renge tıklandı
                renkDegistir(renkKey); //parent a bildir
              }}
              className={`
                w-6 h-6 rounded-full border-2 transition-all hover:scale-110
                ${seciliMi ? 'border-gray-700 scale-110' : 'border-gray-300'}
              `}
              style={{ backgroundColor: bilgi.hexKod }} //inline style ile renk verdim
              title={bilgi.isim}
            >
            </button>
          );
        })}
      </div>
      
      {/* seçili rengin ismini göster, montserrat regular 15px */}
      <span className="color-name text-gray-700">
        {renkBilgileri[secilenRenk].isim}
      </span>
      
    </div>
  );
}

export default ColorPicker;