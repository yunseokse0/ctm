import React, { useEffect } from 'react';
import './QrCodeModal.css';
import QRCodeGenerator from './QRCodeGenerator';

const QrCodeModal = ({ onClose, walletAddress }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="qr-modal-overlay" onClick={onClose}>
      <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="qr-modal-header">
          <h2>USDT TRC-20 QR Code</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="qr-modal-body">
            <div className="qr-image-container">
              <QRCodeGenerator 
                walletAddress={walletAddress}
                size={200}
              />
            </div>
          
              <div className="qr-instructions">
                <h3>How to Donate:</h3>
                <div className="wallet-address">
                  <strong>Address:</strong> {walletAddress}
                </div>
                <div className="network-warning">
                  <strong>Network:</strong> Tron (TRC-20)
                </div>
                <div className="shortlink-info">
                  <strong>Short Link:</strong> <a href="https://ctm-4d7u3szql-yunseokseos-projects.vercel.app" target="_blank" rel="noopener noreferrer">ctm.vercel.app</a>
                </div>
            <ol>
              <li>Open your USDT wallet app</li>
              <li>Scan this QR code or copy the address</li>
              <li>Send USDT (TRC-20 network only)</li>
              <li>Thank you for supporting our initiative!</li>
            </ol>
            <div className="warning-box">
              <strong>⚠️ Important:</strong> Only send USDT (TRC-20) to this address. Other tokens will be lost.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrCodeModal;
