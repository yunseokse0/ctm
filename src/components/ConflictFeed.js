import React from 'react';
import './ConflictFeed.css';

const ConflictFeed = ({ conflicts, selectedConflict, onConflictSelect, onSearchConflict }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'War': return '#dc3545';
      case 'Conflict': return '#fd7e14';
      case 'Disorder': return '#ffc107';
      default: return '#6c757d';
    }
  };


  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'War': return '⚔️';
      case 'Conflict': return '⚡';
      case 'Disorder': return '⚠️';
      default: return '❓';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="conflict-feed">
          <div className="conflict-feed-header">
            <h2>Conflict Log & Analysis Feed</h2>
            <div className="conflict-count">
              {conflicts.length} Active Conflicts
            </div>
            <div className="donation-reminder">
              💝 <strong>Support our mission:</strong> Help us maintain free, unbiased conflict monitoring
            </div>
          </div>
      
      <div className="conflict-list">
        {conflicts.map(conflict => (
          <div 
            key={conflict.id}
            className={`conflict-item ${selectedConflict?.id === conflict.id ? 'selected' : ''}`}
            onClick={() => onConflictSelect(conflict)}
          >
            <div className="conflict-item-header">
              <div 
                className="severity-indicator"
                style={{ backgroundColor: getSeverityColor(conflict.severity) }}
              >
                {getSeverityIcon(conflict.severity)}
              </div>
              <div className="conflict-info">
                <h3 className="conflict-name">{conflict.name}</h3>
                <div className="conflict-meta">
                  <span className="conflict-date">{formatDate(conflict.startDate)}</span>
                  <span className="conflict-type">{conflict.type}</span>
                </div>
              </div>
            </div>
            
            <div className="conflict-details">
              {conflict.casualties && (
                <div className="conflict-casualties">
                  💀 <strong>Casualties:</strong> {conflict.casualties}
                </div>
              )}
              <div className="key-actors">
                <strong>Key Actors:</strong> {conflict.keyActors.join(', ')}
              </div>
              <div className="conflict-status">
                <span className={`status-badge ${conflict.status.toLowerCase()}`}>
                  {conflict.status}
                </span>
              </div>
            </div>
            
            <div className="conflict-actions">
              <button 
                className="search-button"
                onClick={() => onSearchConflict(conflict)}
              >
                🔍 Search Details
              </button>
              {conflict.externalLink && (
                <a 
                  href={conflict.externalLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="external-link"
                >
                  View Source →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConflictFeed;
