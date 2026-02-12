'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapPickerProps {
  onLocationSelect: (location: {
    locationName: string;
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  initialLocation?: {
    latitude: number;
    longitude: number;
  };
}

export default function KakaoMapPicker({ onLocationSelect, initialLocation }: KakaoMapPickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;
    console.log('🗺️ Kakao Map API Key:', apiKey ? `${apiKey.substring(0, 8)}...` : 'undefined');
    
    if (!apiKey) {
      setError('API 키가 설정되지 않았습니다. .env.local 파일을 확인하세요.');
      setIsLoading(false);
      return;
    }

    // 이미 스크립트가 로드되어 있는지 확인
    if (window.kakao && window.kakao.maps) {
      console.log('✅ Kakao SDK already loaded');
      initializeMap();
      return;
    }

    const script = document.createElement('script');
    const scriptSrc = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`;
    script.src = scriptSrc;
    script.async = true;
    
    console.log('📡 Loading Kakao SDK from:', scriptSrc);
    
    script.onload = () => {
      console.log('✅ Kakao SDK script loaded successfully');
      initializeMap();
    };

    script.onerror = (e) => {
      console.error('❌ Failed to load Kakao SDK:', e);
      console.error('Script URL:', scriptSrc);
      setError('카카오맵을 불러올 수 없습니다. API 키를 확인해주세요.');
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      // 스크립트가 존재할 때만 제거
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const initializeMap = () => {
    if (!window.kakao || !window.kakao.maps) {
      console.error('❌ window.kakao or window.kakao.maps is undefined');
      setError('카카오맵 API를 불러올 수 없습니다.');
      setIsLoading(false);
      return;
    }

    console.log('🗺️ Initializing Kakao Map...');
    window.kakao.maps.load(() => {
      console.log('✅ Kakao Map loaded successfully');
      if (!mapContainer.current) return;

      const options = {
        center: new window.kakao.maps.LatLng(
          initialLocation?.latitude || 37.5665,
          initialLocation?.longitude || 126.9780
        ),
        level: 3
      };

      const mapInstance = new window.kakao.maps.Map(mapContainer.current, options);
      setMap(mapInstance);

      const markerInstance = new window.kakao.maps.Marker({
        position: options.center,
        map: mapInstance
      });
      setMarker(markerInstance);

      // 지도 클릭 이벤트
      window.kakao.maps.event.addListener(mapInstance, 'click', (mouseEvent: any) => {
        const latlng = mouseEvent.latLng;
        markerInstance.setPosition(latlng);

        // 좌표로 주소 검색
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.coord2Address(latlng.getLng(), latlng.getLat(), (result: any, status: any) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const address = result[0].address.address_name;
            onLocationSelect({
              locationName: result[0].address.region_3depth_name || address,
              latitude: latlng.getLat(),
              longitude: latlng.getLng(),
              address: address
            });
          }
        });
      });

      setIsLoading(false);
    });
  };

  const handleSearch = () => {
    if (!map || !searchKeyword.trim()) return;

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(searchKeyword, (data: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const place = data[0];
        const position = new window.kakao.maps.LatLng(place.y, place.x);

        map.setCenter(position);
        marker.setPosition(position);

        onLocationSelect({
          locationName: place.place_name,
          latitude: parseFloat(place.y),
          longitude: parseFloat(place.x),
          address: place.address_name
        });
      } else {
        alert('검색 결과가 없습니다.');
      }
    });
  };

  if (error) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#FEE',
        borderRadius: '8px',
        border: '1px solid #F88'
      }}>
        <p style={{ color: '#C33', fontSize: '14px', margin: 0 }}>
          ❌ {error}
        </p>
        <p style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>
          .env.local 파일의 NEXT_PUBLIC_KAKAO_MAP_API_KEY를 확인하세요.
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="장소명 또는 주소를 검색하세요"
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
        <button
          type="button"
          onClick={handleSearch}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1976D2',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          검색
        </button>
      </div>
      <div
        ref={mapContainer}
        style={{
          width: '100%',
          height: '400px',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          position: 'relative'
        }}
      >
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: '#999',
            fontSize: '14px'
          }}>
            지도를 불러오는 중...
          </div>
        )}
      </div>
      <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
        💡 지도를 클릭하거나 검색하여 강의 위치를 선택하세요
      </p>
    </div>
  );
}
