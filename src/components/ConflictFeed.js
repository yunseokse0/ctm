import React, { useState } from 'react';
import './ConflictFeed.css';

const ConflictFeed = ({ conflicts, selectedConflict, onConflictSelect, onSearchConflict }) => {
  const [expandedItems, setExpandedItems] = useState(new Set());
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

  const toggleExpanded = (conflictId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(conflictId)) {
      newExpanded.delete(conflictId);
    } else {
      newExpanded.add(conflictId);
    }
    setExpandedItems(newExpanded);
  };

  const isExpanded = (conflictId) => expandedItems.has(conflictId);

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
            className={`conflict-item ${selectedConflict?.id === conflict.id ? 'selected' : ''} ${isExpanded(conflict.id) ? 'expanded' : ''}`}
          >
            <div className="conflict-item-header" onClick={() => onConflictSelect(conflict)}>
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
              <button 
                className="expand-button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpanded(conflict.id);
                }}
                title={isExpanded(conflict.id) ? '상세 정보 닫기' : '상세 정보 보기'}
              >
                {isExpanded(conflict.id) ? '−' : '+'}
              </button>
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
            
            {isExpanded(conflict.id) && (
              <div className="conflict-expanded-details">
                <div className="expanded-section">
                  <h4>📊 Conflict Analysis</h4>
                  <div className="analysis-grid">
                    <div className="analysis-item">
                      <strong>Severity Level:</strong>
                      <span className={`severity-badge ${conflict.severity.toLowerCase()}`}>
                        {conflict.severity}
                      </span>
                    </div>
                    <div className="analysis-item">
                      <strong>Duration:</strong>
                      <span>{Math.floor((new Date() - new Date(conflict.startDate)) / (1000 * 60 * 60 * 24))} days</span>
                    </div>
                    <div className="analysis-item">
                      <strong>Type:</strong>
                      <span>{conflict.type}</span>
                    </div>
                    <div className="analysis-item">
                      <strong>Status:</strong>
                      <span className={`status-badge ${conflict.status.toLowerCase()}`}>
                        {conflict.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="expanded-section">
                  <h4>🎯 Key Information</h4>
                  <div className="info-list">
                    <div className="info-item">
                      <strong>Start Date:</strong> {formatDate(conflict.startDate)}
                    </div>
                    {conflict.casualties && (
                      <div className="info-item">
                        <strong>Casualties:</strong> {conflict.casualties}
                      </div>
                    )}
                    <div className="info-item">
                      <strong>Key Actors:</strong> {conflict.keyActors.join(', ')}
                    </div>
                    {conflict.description && (
                      <div className="info-item">
                        <strong>Description:</strong> {conflict.description}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
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
