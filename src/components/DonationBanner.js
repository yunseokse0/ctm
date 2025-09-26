import React, { useState, useEffect } from 'react';
import './DonationBanner.css';

const DonationBanner = ({ walletAddress, onShowQr }) => {
  const [copied, setCopied] = useState(false);
  // const [showUrgency, setShowUrgency] = useState(false);
  const [timeOnSite, setTimeOnSite] = useState(0);

  useEffect(() => {
    // 사이트 체류 시간 추적
    const interval = setInterval(() => {
      setTimeOnSite(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 2분 후 긴급성 메시지 표시
  // useEffect(() => {
  //   if (timeOnSite > 120) {
  //     setShowUrgency(true);
  //   }
  // }, [timeOnSite]);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  return (
    <div className="donation-banner">
      <div className="donation-content">
        <div className="donation-header">
          <div className="lightning-icon">⚡</div>
          <h3>Sustain Our Data Initiative</h3>
          {/* {showUrgency && (
            <div className="urgency-message">
              <strong>Critical:</strong> Your support helps us provide free, unbiased conflict information to millions worldwide
            </div>
          )} */}
        </div>
        
        <div className="donation-address">
          <span className="address-label">USDT TRC-20:</span>
          <span className="address-value">{walletAddress}</span>
          <div className="network-info">
            <span className="network-badge">Tron (TRC-20)</span>
          </div>
        </div>
        
        <div className="donation-buttons">
          <button 
            className="copy-button"
            onClick={copyAddress}
          >
            {copied ? 'Address Copied!' : 'Copy Address'}
          </button>
          <button 
            className="qr-button"
            onClick={onShowQr}
          >
            Show QR Code
          </button>
        </div>
        
        <div className="warning-message">
          ⚠️ Only send USDT (TRC-20) to this address. Other tokens will be lost.
        </div>
      </div>
    </div>
  );
};

export default DonationBanner;
