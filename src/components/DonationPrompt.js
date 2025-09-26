import React, { useState, useEffect } from 'react';
import './DonationPrompt.css';

const DonationPrompt = ({ onShowQr, onClose }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [timeOnSite, setTimeOnSite] = useState(0);

  useEffect(() => {
    // 30초 후에 도네이션 팝업 표시
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 30000);

    // 사이트 체류 시간 추적
    const interval = setInterval(() => {
      setTimeOnSite(prev => prev + 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  // 5분마다 도네이션 팝업 표시
  useEffect(() => {
    if (timeOnSite > 0 && timeOnSite % 300 === 0) {
      setShowPrompt(true);
    }
  }, [timeOnSite]);

  if (!showPrompt) return null;

  return (
    <div className="donation-prompt-overlay">
      <div className="donation-prompt-content">
        <div className="donation-prompt-header">
          <h3>💝 Support Our Mission</h3>
          <button className="close-prompt" onClick={() => {
            setShowPrompt(false);
            onClose();
          }}>
            ×
          </button>
        </div>
        
        <div className="donation-prompt-body">
          <div className="prompt-icon">🌍</div>
          <p className="prompt-message">
            Help us maintain and improve the Conflict Traces Map. 
            Your donation supports real-time conflict monitoring and humanitarian efforts.
          </p>
          
          <div className="donation-benefits">
            <div className="benefit-item">
              <span className="benefit-icon">⚡</span>
              <span>Real-time conflict updates</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">📊</span>
              <span>Advanced analytics & statistics</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🔍</span>
              <span>Detailed conflict research tools</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🌐</span>
              <span>Global humanitarian impact</span>
            </div>
          </div>
          
          <div className="prompt-actions">
            <button 
              className="donate-button"
              onClick={() => {
                onShowQr();
                setShowPrompt(false);
              }}
            >
              💰 Donate USDT
            </button>
            <button 
              className="later-button"
              onClick={() => {
                setShowPrompt(false);
                onClose();
              }}
            >
              Maybe Later
            </button>
          </div>
          
          <div className="prompt-footer">
            <small>Every donation helps us provide free, unbiased conflict information to the world.</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationPrompt;
