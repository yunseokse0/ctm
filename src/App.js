import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import MapComponent from './components/MapComponent';
import DonationBanner from './components/DonationBanner';
import QrCodeModal from './components/QrCodeModal';
import ConflictFeed from './components/ConflictFeed';
import SeverityFilter from './components/SeverityFilter';
import SearchModal from './components/SearchModal';
import StatsDashboard from './components/StatsDashboard';
import AdvancedFilters from './components/AdvancedFilters';
// import DonationPrompt from './components/DonationPrompt';
import useRealtimeUpdates from './hooks/useRealtimeUpdates';

function App() {
  const [conflicts, setConflicts] = useState([]);
  const [filteredConflicts, setFilteredConflicts] = useState([]);
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchConflict, setSearchConflict] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  // const [showDonationPrompt, setShowDonationPrompt] = useState(false);
  const [severityFilters, setSeverityFilters] = useState({
    war: true,
    conflict: true,
    disorder: true
  });
  const [advancedFilters, setAdvancedFilters] = useState({
    dateRange: { start: '', end: '' },
    region: 'all',
    status: 'all',
    severity: 'all'
  });

  const USDT_WALLET_ADDRESS = "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE";

  // 실시간 업데이트 훅 사용
  const { isUpdating, updateCount, manualRefresh } = useRealtimeUpdates();

  useEffect(() => {
    // 분쟁 데이터 로드
    fetch('/conflicts.json')
      .then(response => response.json())
      .then(data => {
        setConflicts(data);
        setFilteredConflicts(data);
      })
      .catch(error => console.error('Error loading conflicts:', error));
  }, []);

  // 실시간 업데이트된 데이터 처리
  useEffect(() => {
    if (updateCount > 0) {
      fetch('/conflicts.json')
        .then(response => response.json())
        .then(data => {
          setConflicts(data);
          // 필터링 로직도 다시 적용
          applyFilters(data, severityFilters, advancedFilters);
        })
        .catch(error => console.error('Error loading updated conflicts:', error));
    }
  }, [updateCount, severityFilters, advancedFilters]);

  // 통합 필터링 함수
  const applyFilters = useCallback((conflictsData, severityFilters, advancedFilters) => {
    return conflictsData.filter(conflict => {
      // 심각도 필터
      if (conflict.severity === 'War' && !severityFilters.war) return false;
      if (conflict.severity === 'Conflict' && !severityFilters.conflict) return false;
      if (conflict.severity === 'Disorder' && !severityFilters.disorder) return false;

      // 고급 필터
      if (advancedFilters.severity !== 'all' && conflict.severity !== advancedFilters.severity) return false;
      if (advancedFilters.status !== 'all' && conflict.status !== advancedFilters.status) return false;

      // 날짜 범위 필터
      if (advancedFilters.dateRange.start) {
        const conflictDate = new Date(conflict.startDate);
        const startDate = new Date(advancedFilters.dateRange.start);
        if (conflictDate < startDate) return false;
      }
      if (advancedFilters.dateRange.end) {
        const conflictDate = new Date(conflict.startDate);
        const endDate = new Date(advancedFilters.dateRange.end);
        if (conflictDate > endDate) return false;
      }

      // 지역 필터 (간단한 구현)
      if (advancedFilters.region !== 'all') {
        const region = getRegionFromCoordinates(conflict.lat, conflict.lng);
        if (region !== advancedFilters.region) return false;
      }

      return true;
    });
  }, []);

  // 좌표에서 지역 추출
  const getRegionFromCoordinates = (lat, lng) => {
    if (lat > 35 && lat < 70 && lng > -20 && lng < 40) return 'Europe';
    if (lat > 10 && lat < 35 && lng > 30 && lng < 60) return 'Middle East';
    if (lat > -35 && lat < 35 && lng > 20 && lng < 50) return 'Africa';
    if (lat > 5 && lat < 50 && lng > 70 && lng < 140) return 'Asia';
    if (lat > -60 && lat < 15 && lng > -120 && lng < -30) return 'Americas';
    return 'Other';
  };

  useEffect(() => {
    // 통합 필터 적용
    const filtered = applyFilters(conflicts, severityFilters, advancedFilters);
    setFilteredConflicts(filtered);
  }, [conflicts, severityFilters, advancedFilters, applyFilters]);

  const handleConflictSelect = (conflict) => {
    setSelectedConflict(conflict);
  };

  const handleSeverityFilterChange = (severity) => {
    setSeverityFilters(prev => ({
      ...prev,
      [severity]: !prev[severity]
    }));
  };

  const handleSearchConflict = (conflict) => {
    setSearchConflict(conflict);
    setShowSearchModal(true);
  };

  const handleAdvancedFilterChange = (newFilters) => {
    setAdvancedFilters(newFilters);
  };

  const handleManualRefresh = async () => {
    const data = await manualRefresh();
    if (data) {
      setConflicts(data);
    }
  };

  return (
    <div className="App">
      <div className="main-container">
        <div className="controls-header">
          <SeverityFilter 
            filters={severityFilters}
            onFilterChange={handleSeverityFilterChange}
          />
          
          <div className="control-buttons">
            <button 
              className={`control-button ${showStats ? 'active' : ''}`}
              onClick={() => setShowStats(!showStats)}
            >
              📊 Stats
            </button>
            <button 
              className={`control-button ${showAdvancedFilters ? 'active' : ''}`}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              🔍 Filters
            </button>
            <button 
              className="control-button refresh"
              onClick={handleManualRefresh}
              disabled={isUpdating}
            >
              {isUpdating ? '⏳' : '🔄'} Refresh
            </button>
          </div>
        </div>
        
        <div className="content-container">
          <MapComponent 
            conflicts={filteredConflicts}
            onConflictSelect={handleConflictSelect}
          />
          
          <ConflictFeed 
            conflicts={conflicts}
            selectedConflict={selectedConflict}
            onConflictSelect={handleConflictSelect}
            onSearchConflict={handleSearchConflict}
          />
        </div>

        {showStats && (
          <StatsDashboard conflicts={conflicts} />
        )}

        {showAdvancedFilters && (
          <AdvancedFilters 
            onFilterChange={handleAdvancedFilterChange}
            conflicts={conflicts}
          />
        )}

        <DonationBanner
          walletAddress={USDT_WALLET_ADDRESS}
          onShowQr={() => setShowQrModal(true)}
        />

        {/* <DonationPrompt
          onShowQr={() => setShowQrModal(true)}
          onClose={() => setShowDonationPrompt(false)}
        /> */}
        
        {showQrModal && (
          <QrCodeModal 
            onClose={() => setShowQrModal(false)}
            walletAddress={USDT_WALLET_ADDRESS}
          />
        )}

        {showSearchModal && (
          <SearchModal 
            conflict={searchConflict}
            isOpen={showSearchModal}
            onClose={() => setShowSearchModal(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
