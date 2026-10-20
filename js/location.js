// 오시는 길 — 네이버 지도
// 지도 검색에는 층·호수를 뺀 도로명주소를 쓴다. (표시용 전체 주소는 location.html)
const MAP_QUERY = '서울특별시 송파구 올림픽로 300';
const MAP_ZOOM = 17;
// 주소 검색에 실패했을 때 쓰는 대략적인 좌표 (주소 검색이 안 될 때만 사용)
// TODO: 확인 필요 — 정확한 좌표가 확정되면 교체
const FALLBACK_CENTER = { lat: 37.5126, lng: 127.1025 };

const mapElement = document.querySelector('[data-map]');
const messageElement = document.querySelector('[data-map-message]');

const showMessage = (text, isNotice = false) => {
  if (!messageElement) return;
  messageElement.textContent = text;
  messageElement.classList.toggle('map-message-notice', isNotice);
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

  // 주소 검색(geocoder)을 쓸 수 없으면 대략적인 좌표에 마커를 찍는다.
  if (!naver.maps.Service) {
    new naver.maps.Marker({ position: map.getCenter(), map, title: MAP_QUERY });
    showMessage('주소 검색을 사용할 수 없어 대략적인 위치를 표시합니다.', true);
    return;
  }

  // 최초 로딩 시 MAP_QUERY 위치로 이동하고 마커를 표시한다.
  naver.maps.Service.geocode({ query: MAP_QUERY }, (status, response) => {
    const result = response && response.v2 && response.v2.addresses && response.v2.addresses[0];
    if (status !== naver.maps.Service.Status.OK || !result) {
      showMessage('정확한 위치를 찾지 못해 근처 지도를 보여 드립니다.', true);
      return;
    }

    const position = new naver.maps.LatLng(Number(result.y), Number(result.x));
    map.setCenter(position);
    new naver.maps.Marker({ position, map, title: MAP_QUERY });
  });
};

initMap();
