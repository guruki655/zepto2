import React from 'react';
import zeptoBanner from '../images/zeptoHomeBanner.webp';


const PaanCorner = () => {
  return (
    <div
      style={{
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        backgroundColor: '#f9f9f9',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Banner Image */}
      {/* <img
        src={zeptoBanner}// Update this path based on your public folder setup
        alt="Paan Corner Banner"
        style={{
          width: '100%',
          maxWidth: '1280px',
          height: 'auto',
          borderRadius: '10px',
          marginTop: '20px',
        }}
      /> */}

      {/* Coming Soon Message */}
      <div
        style={{
          textAlign: 'center',
          marginTop: '40px',
          padding: '0 20px',
        }}
      >
        <h1
          style={{
            fontSize: '24px',
            color: '#2c3e50',
            marginBottom: '10px',
          }}
        >
          We're exploring more paan products for you!
        </h1>
        <p
          style={{
            fontSize: '20px',
            color: '#555',
          }}
        >
          Coming Soon 🍃
        </p>
      </div>
    </div>
  );
};

export default PaanCorner;
