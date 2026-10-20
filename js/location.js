// 오시는 길 — 네이버 지도
// 지도 검색에는 층·호수를 뺀 도로명주소를 쓴다. (표시용 전체 주소는 location.html)
const MAP_QUERY = '서울특별시 송파구 올림픽로 300';
const MAP_ZOOM = 17;
// 주소 검색에 실패했을 때 쓰는 대략적인 좌표 (정확한 값이 아니므로 마커는 찍지 않는다)
// TODO: 확인 필요 — 정확한 좌표가 확정되면 교체
const FALLBACK_CENTER = { lat: 37.5126, lng: 127.1025 };

const mapElement = document.querySelector('[data-map]');
const messageElement = document.querySelector('[data-map-message]');

const showMessage = (text) => {
  if (!messageElement) return;
  messageElement.textContent = text;
  messageElement.hidden = false;
};

const hideMessage = () => {
  if (messageElement) messageElement.hidden = true;
};

// 인증 실패(등록되지 않은 주소에서 접속 등)
window.navermap_authFailure = () => {
  showMessage('지도를 불러오지 못했습니다. 주소와 교통편은 아래 안내를 확인해 주세요.');
};

const initMap = () => {
  if (!mapElement) return;

  if (!window.naver || !window.naver.maps) {
    showMessage('지도를 불러오지 못했습니다. 주소와 교통편은 아래 안내를 확인해 주세요.');
    return;
  }

  const { naver } = window;
  const map = new naver.maps.Map(mapElement, {
    center: new naver.maps.LatLng(FALLBACK_CENTER.lat, FALLBACK_CENTER.lng),
    zoom: MAP_ZOOM,
  });
  hideMessage();

  if (!naver.maps.Service) {
    showMessage('위치 검색을 사용할 수 없어 임시 지도를 보여 드립니다.');
    return;
  }

  // 최초 로딩 시 MAP_QUERY 위치로 이동하고 마커를 표시한다.
  naver.maps.Service.geocode({ query: MAP_QUERY }, (status, response) => {
    const result = response && response.v2 && response.v2.addresses && response.v2.addresses[0];
    if (status !== naver.maps.Service.Status.OK || !result) {
      showMessage('정확한 위치를 찾지 못해 근처 지도를 보여 드립니다.');
      return;
    }

    const position = new naver.maps.LatLng(Number(result.y), Number(result.x));
    map.setCenter(position);
    new naver.maps.Marker({ position, map, title: MAP_QUERY });
  });
};

initMap();
