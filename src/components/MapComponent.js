import React, { useEffect, useRef, useCallback, useState } from 'react';
import mapboxgl from 'mapbox-gl';

const MapComponent = ({ conflicts, onConflictSelect, onRegionSelect, selectedRegion }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const [mapError, setMapError] = useState(false);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'War': return 'red';
      case 'Conflict': return 'orange';
      case 'Disorder': return 'yellow';
      default: return 'gray';
    }
  };

  // 좌표에서 지역 추출
  const getRegionFromCoordinates = (lat, lng) => {
    if (lat > 35 && lat < 70 && lng > -20 && lng < 40) return 'Europe';
    if (lat > 10 && lat < 35 && lng > 30 && lng < 60) return 'Middle East';
    if (lat > -35 && lat < 35 && lng > 20 && lng < 50) return 'Africa';
    if (lat > 5 && lat < 50 && lng > 70 && lng < 140) return 'Asia';
    if (lat > -60 && lat < 15 && lng > -120 && lng < -30) return 'Americas';
    return 'Other';
  };

  const showPopup = (conflict) => {
    new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false
    })
      .setLngLat([conflict.lng, conflict.lat])
      .setHTML(`
        <div style="color: #ffffff; background: #2d2d2d; padding: 10px; border-radius: 5px;">
          <h3 style="margin: 0 0 5px 0; color: #ffffff;">${conflict.name}</h3>
          <p style="margin: 0; color: #cccccc;">${conflict.severity}</p>
        </div>
      `)
      .addTo(map.current);
  };

  const clearMarkers = () => {
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
  };

  const addMarkers = useCallback(() => {
    if (!map.current) return;

    conflicts.forEach(conflict => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = `url(/images/icon_${conflict.severity.toLowerCase()}_${getSeverityColor(conflict.severity)}.svg)`;
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.backgroundSize = 'contain';
      el.style.cursor = 'pointer';

      const marker = new mapboxgl.Marker(el)
        .setLngLat([conflict.lng, conflict.lat])
        .addTo(map.current);

      el.addEventListener('click', () => {
        onConflictSelect(conflict);
        showPopup(conflict);
      });

      markers.current.push(marker);
    });
  }, [conflicts, onConflictSelect]);

  useEffect(() => {
    if (map.current) return; // 이미 지도가 초기화된 경우

    // Mapbox 토큰 설정
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm'
          }
        ]
      },
      center: [0, 0],
      zoom: 1.5
    });

    map.current.on('load', () => {
      console.log('Map loaded successfully');
      addMarkers();
    });

    // 지도 클릭 이벤트 추가
    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      const region = getRegionFromCoordinates(lat, lng);
      
      if (onRegionSelect) {
        onRegionSelect(region);
        
        // 지역 선택 피드백을 위한 팝업
        new mapboxgl.Popup({
          closeButton: true,
          closeOnClick: false
        })
          .setLngLat([lng, lat])
          .setHTML(`
            <div style="color: #ffffff; background: #2d2d2d; padding: 10px; border-radius: 5px;">
              <h3 style="margin: 0 0 5px 0; color: #007bff;">📍 ${region} 지역 선택</h3>
              <p style="margin: 0; color: #cccccc;">이 지역의 충돌 정보만 표시됩니다</p>
            </div>
          `)
          .addTo(map.current);
      }
    });

    map.current.on('error', (e) => {
      console.error('Map error:', e);
      setMapError(true);
    });
  }, [addMarkers]);

  useEffect(() => {
    if (map.current) {
      clearMarkers();
      addMarkers();
    }
  }, [conflicts, addMarkers]);

  if (mapError) {
    return (
      <div className="map-container">
        <div className="map-error">
          <h3>지도를 불러올 수 없습니다</h3>
          <p>Mapbox 토큰을 확인하거나 네트워크 연결을 확인해주세요.</p>
          <button onClick={() => window.location.reload()}>새로고침</button>
        </div>
      </div>
    );
  }

  return (
    <div className="map-container">
      <div ref={mapContainer} className="map" style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default MapComponent;