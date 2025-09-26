import React from 'react';
import './SeverityFilter.css';

const SeverityFilter = ({ filters, onFilterChange }) => {
  const filterOptions = [
    { key: 'war', label: 'Tier 1: War', color: '#dc3545' },
    { key: 'conflict', label: 'Tier 2: Active Conflict', color: '#fd7e14' },
    { key: 'disorder', label: 'Tier 3: Civil Disorder', color: '#ffc107' }
  ];

  return (
    <div className="severity-filter">
      <div className="filter-container">
        <h3 className="filter-title">Filter by Severity</h3>
        <div className="filter-toggles">
          {filterOptions.map(option => (
            <button
              key={option.key}
              className={`filter-toggle ${filters[option.key] ? 'active' : ''}`}
              style={{
                '--toggle-color': option.color,
                borderColor: filters[option.key] ? option.color : '#444444'
              }}
              onClick={() => onFilterChange(option.key)}
            >
              <div className="toggle-indicator">
                <div 
                  className="toggle-dot"
                  style={{ 
                    backgroundColor: filters[option.key] ? option.color : '#666666'
                  }}
                />
              </div>
              <span className="toggle-label">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeverityFilter;
