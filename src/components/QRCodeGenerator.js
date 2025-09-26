import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

const QRCodeGenerator = ({ walletAddress, size = 200 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const canvas = canvasRef.current;
        if (canvas && walletAddress) {
          // QR 코드 생성
          await QRCode.toCanvas(canvas, walletAddress, {
            width: size,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
        }
      } catch (error) {
        console.error('QR 코드 생성 오류:', error);
      }
    };

    generateQRCode();
  }, [walletAddress, size]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: size,
        height: size,
        borderRadius: '8px',
        border: '1px solid #444444'
      }}
    />
  );
};

export default QRCodeGenerator;
