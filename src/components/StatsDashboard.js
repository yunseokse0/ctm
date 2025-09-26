import React from 'react';
import './StatsDashboard.css';

const StatsDashboard = ({ conflicts }) => {
  // 통계 계산
  const totalConflicts = conflicts.length;
  const warCount = conflicts.filter(c => c.severity === 'War').length;
  const conflictCount = conflicts.filter(c => c.severity === 'Conflict').length;
  const disorderCount = conflicts.filter(c => c.severity === 'Disorder').length;
  const ongoingCount = conflicts.filter(c => c.status === 'Ongoing').length;
  const resolvedCount = conflicts.filter(c => c.status === 'Resolved').length;
  // const suppressedCount = conflicts.filter(c => c.status === 'Suppressed').length;

  // 총 피해자 수 계산 (대략적)
  const totalCasualties = conflicts.reduce((total, conflict) => {
    if (conflict.casualties) {
      const casualties = conflict.casualties.replace(/[^\d]/g, '');
      return total + parseInt(casualties) || 0;
    }
    return total;
  }, 0);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="stats-dashboard">
      <div className="stats-header">
        <h3>Global Conflict Statistics</h3>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">🌍</div>
          <div className="stat-content">
            <div className="stat-number">{totalConflicts}</div>
            <div className="stat-label">Total Conflicts</div>
          </div>
        </div>

        <div className="stat-card casualties">
          <div className="stat-icon">💀</div>
          <div className="stat-content">
            <div className="stat-number">{formatNumber(totalCasualties)}+</div>
            <div className="stat-label">Total Casualties</div>
          </div>
        </div>

        <div className="stat-card ongoing">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <div className="stat-number">{ongoingCount}</div>
            <div className="stat-label">Ongoing</div>
          </div>
        </div>

        <div className="stat-card resolved">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">{resolvedCount}</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>
      </div>

      <div className="severity-breakdown">
        <h4>Severity Breakdown</h4>
        <div className="severity-bars">
          <div className="severity-bar war">
            <div className="bar-label">War</div>
            <div className="bar-container">
              <div 
                className="bar-fill" 
                style={{ width: `${(warCount / totalConflicts) * 100}%` }}
              ></div>
            </div>
            <div className="bar-value">{warCount}</div>
          </div>
          
          <div className="severity-bar conflict">
            <div className="bar-label">Conflict</div>
            <div className="bar-container">
              <div 
                className="bar-fill" 
                style={{ width: `${(conflictCount / totalConflicts) * 100}%` }}
              ></div>
            </div>
            <div className="bar-value">{conflictCount}</div>
          </div>
          
          <div className="severity-bar disorder">
            <div className="bar-label">Disorder</div>
            <div className="bar-container">
              <div 
                className="bar-fill" 
                style={{ width: `${(disorderCount / totalConflicts) * 100}%` }}
              ></div>
            </div>
            <div className="bar-value">{disorderCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
