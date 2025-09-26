import React, { useState, useEffect } from 'react';
import './SearchModal.css';

const SearchModal = ({ conflict, isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEngine, setSelectedEngine] = useState('google');

  useEffect(() => {
    if (conflict && isOpen) {
      const formattedDate = new Date(conflict.startDate).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      setSearchQuery(`${conflict.name} ${conflict.type} ${formattedDate}`);
    }
  }, [conflict, isOpen]);

  const searchEngines = [
    { id: 'google', name: 'Google', url: 'https://www.google.com/search?q=' },
    { id: 'bing', name: 'Bing', url: 'https://www.bing.com/search?q=' },
    { id: 'duckduckgo', name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
    { id: 'youtube', name: 'YouTube', url: 'https://www.youtube.com/results?search_query=' },
    { id: 'twitter', name: 'Twitter', url: 'https://twitter.com/search?q=' }
  ];

  const handleSearch = (engineId) => {
    const engine = searchEngines.find(e => e.id === engineId);
    if (engine) {
      const url = `${engine.url}${encodeURIComponent(searchQuery)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleQuickSearch = () => {
    handleSearch(selectedEngine);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleQuickSearch();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <h2>Search Conflict Details</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="search-modal-body">
          {conflict && (
            <div className="conflict-info">
              <h3>{conflict.name}</h3>
              <div className="conflict-meta">
                <span className="conflict-type">{conflict.type}</span>
                <span className="conflict-date">
                  {new Date(conflict.startDate).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })}
                </span>
                <span className="conflict-severity">{conflict.severity}</span>
              </div>
              <div className="conflict-actors">
                <strong>Key Actors:</strong> {conflict.keyActors.join(', ')}
              </div>
            </div>
          )}
          
          <div className="search-section">
            <div className="search-input-group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter search terms..."
                className="search-input"
              />
              <button 
                className="search-submit-button"
                onClick={handleQuickSearch}
              >
                Search
              </button>
            </div>
            
            <div className="search-engines">
              <h4>Search Engines:</h4>
              <div className="engine-buttons">
                {searchEngines.map(engine => (
                  <button
                    key={engine.id}
                    className={`engine-button ${selectedEngine === engine.id ? 'active' : ''}`}
                    onClick={() => setSelectedEngine(engine.id)}
                  >
                    {engine.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="quick-search-buttons">
              <h4>Quick Search:</h4>
              <div className="quick-buttons">
                <button 
                  className="quick-search-btn google"
                  onClick={() => handleSearch('google')}
                >
                  🔍 Google
                </button>
                <button 
                  className="quick-search-btn youtube"
                  onClick={() => handleSearch('youtube')}
                >
                  📺 YouTube
                </button>
                <button 
                  className="quick-search-btn twitter"
                  onClick={() => handleSearch('twitter')}
                >
                  🐦 Twitter
                </button>
                <button 
                  className="quick-search-btn news"
                  onClick={() => handleSearch('news')}
                >
                  📰 News
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
