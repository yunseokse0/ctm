# CTM (Conflict Traces Map)

세계 분쟁 상황을 실시간으로 추적하고 시각화하는 웹 애플리케이션입니다.

## 기능

- 🗺️ **인터랙티브 지도**: Mapbox GL JS를 사용한 고성능 지도
- ⚔️ **분쟁 시각화**: War, Conflict, Disorder 3단계 심각도별 마커
- 📊 **실시간 필터링**: 심각도별 분쟁 필터링 기능
- 📋 **분쟁 피드**: 상세한 분쟁 정보 및 분석 피드
- 💰 **도네이션**: USDT TRC-20 기반 후원 시스템
- 🌙 **다크 테마**: 현대적이고 직관적인 UI

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. Mapbox 토큰 설정
`.env.local` 파일을 생성하고 Mapbox 액세스 토큰을 추가하세요:
```
REACT_APP_MAPBOX_TOKEN=your_mapbox_token_here
```

### 3. 개발 서버 실행
```bash
npm start
```

### 4. 프로덕션 빌드
```bash
npm run build
```

## 기술 스택

- **Frontend**: React 18
- **지도**: Mapbox GL JS
- **스타일링**: CSS3 (다크 테마)
- **데이터**: JSON (로컬)
- **호스팅**: GitHub Pages

## 프로젝트 구조

```
ctm-app/
├── public/
│   ├── conflicts.json          # 분쟁 데이터
│   └── images/                 # 아이콘 및 이미지
├── src/
│   ├── components/
│   │   ├── MapComponent.js     # 지도 컴포넌트
│   │   ├── ConflictFeed.js     # 분쟁 피드
│   │   ├── DonationBanner.js   # 도네이션 배너
│   │   ├── QrCodeModal.js      # QR 코드 모달
│   │   └── SeverityFilter.js   # 심각도 필터
│   ├── App.js                  # 메인 앱
│   └── index.js                # 진입점
└── package.json
```

## 사용법

1. **지도 탐색**: 마우스로 지도를 드래그하여 탐색
2. **마커 클릭**: 분쟁 마커를 클릭하여 상세 정보 확인
3. **필터링**: 상단 필터를 사용하여 심각도별 분쟁 표시/숨김
4. **분쟁 피드**: 우측 패널에서 모든 분쟁 목록 확인
5. **도네이션**: 하단 배너를 통해 USDT 후원

## 데이터 형식

분쟁 데이터는 `public/conflicts.json`에서 관리됩니다:

```json
{
  "id": 1,
  "name": "Ukraine War",
  "lat": 48.3794,
  "lng": 31.1656,
  "startDate": "2022-02-24",
  "type": "International Conflict",
  "severity": "War",
  "keyActors": ["Russia", "Ukraine", "NATO"],
  "status": "Ongoing",
  "externalLink": "https://example.com/ukraine-war"
}
```

## 라이선스

MIT License

## 기여

이슈 리포트나 풀 리퀘스트를 환영합니다.
