import React, { useState } from 'react';
import './AdvancedFilters.css';

const AdvancedFilters = ({ onFilterChange, conflicts }) => {
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    region: 'all',
    status: 'all',
    severity: 'all'
  });

  // 지역 목록 추출
  const regions = [...new Set(conflicts.map(conflict => {
    // 간단한 지역 분류 (실제로는 더 정교한 지역 분류 필요)
    if (conflict.lat > 35 && conflict.lat < 70 && conflict.lng > -20 && conflict.lng < 40) return 'Europe';
    if (conflict.lat > 10 && conflict.lat < 35 && conflict.lng > 30 && conflict.lng < 60) return 'Middle East';
    if (conflict.lat > -35 && conflict.lat < 35 && conflict.lng > 20 && conflict.lng < 50) return 'Africa';
    if (conflict.lat > 5 && conflict.lat < 50 && conflict.lng > 70 && conflict.lng < 140) return 'Asia';
    if (conflict.lat > -60 && conflict.lat < 15 && conflict.lng > -120 && conflict.lng < -30) return 'Americas';
    return 'Other';
  }))];

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateRangeChange = (type, value) => {
    const newFilters = {
      ...filters,
      dateRange: { ...filters.dateRange, [type]: value }
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      dateRange: { start: '', end: '' },
      region: 'all',
      status: 'all',
      severity: 'all'
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="advanced-filters">
      <div className="filters-header">
        <h4>Advanced Filters</h4>
        <button className="clear-filters" onClick={clearFilters}>
          Clear All
        </button>
      </div>

      <div className="filters-grid">
        <div className="filter-group">
          <label>Date Range</label>
          <div className="date-inputs">
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
              placeholder="Start Date"
            />
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => handleDateRangeChange('end', e.target.value)}
              placeholder="End Date"
            />
          </div>
        </div>

        <div className="filter-group">
          <label>Region</label>
          <select
            value={filters.region}
            onChange={(e) => handleFilterChange('region', e.target.value)}
          >
            <option value="all">All Regions</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Resolved">Resolved</option>
            <option value="Suppressed">Suppressed</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Severity</label>
          <select
            value={filters.severity}
            onChange={(e) => handleFilterChange('severity', e.target.value)}
          >
            <option value="all">All Severity</option>
            <option value="War">War</option>
            <option value="Conflict">Conflict</option>
            <option value="Disorder">Disorder</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;
