# 디자인 가이드 — 클래스로(Classro) 회사 소개 홈페이지

> 모든 값은 `css/style.css`의 `:root` 변수로 정의되어 있다. **값을 직접 쓰지 말고 변수를 쓴다.**
> 새 값이 필요하면 팀에 공유한 뒤 `:root`에 변수를 추가한다. (`style.css`는 한 번에 한 명만 수정)

## 1. 디자인 방향
- 동네 공방·작업실의 원데이 클래스에 어울리는 **따뜻하고 손맛 있는** 분위기
- 흙빛 테라코타(메인), 크림색 배경, 짙은 갈색 글자, 올리브 그린(보조)
- 서비스가 모바일 중심이므로 **작은 화면에서 먼저 읽기 좋게** 만든다.

## 2. 색

| 변수 | 값 | 쓰임 |
| --- | --- | --- |
| `--color-primary` | `#b4532a` | 메인 버튼, 링크, 강조 |
| `--color-primary-strong` | `#96431f` | 버튼·링크 hover, 배지 글자 |
| `--color-primary-soft` | `#f6e3d8` | 연한 강조 배경, 배지 배경, 선택 영역 |
| `--color-secondary` | `#5a6b3a` | 보조 강조 (아이콘, 작은 포인트). 넓은 면적에 쓰지 않는다 |
| `--color-bg` | `#fffaf5` | 페이지 배경 |
| `--color-surface` | `#ffffff` | 카드, 입력창 배경 |
| `--color-surface-alt` | `#f7efe6` | 번갈아 쓰는 섹션 배경 |
| `--color-text` | `#2b2420` | 기본 글자 |
| `--color-text-muted` | `#6b5d53` | 보조 글자 (설명, 힌트) |
| `--color-text-on-primary` | `#ffffff` | 메인색 위의 글자 |
| `--color-border` | `#e6dace` | 장식용 구분선, 카드 테두리 |
| `--color-border-strong` | `#8c7f75` | 입력창 테두리 |
| `--color-focus` | `#1d5fb8` | 키보드 포커스 표시 |
| `--color-error` | `#b3261e` | 오류 메시지, 필수 표시, 자리표시자 |
| `--color-success` | `#2e6b3f` | 성공 메시지 |

### 대비 (WCAG AA 기준 확인값)
| 조합 | 대비 | 기준 |
| --- | --- | --- |
| 기본 글자 / 페이지 배경 | 14.7 : 1 | 4.5 이상 ✅ |
| 보조 글자 / 페이지 배경 | 6.1 : 1 | 4.5 이상 ✅ |
| 보조 글자 / 번갈이 섹션 배경 | 5.6 : 1 | 4.5 이상 ✅ |
| 메인색 링크 / 페이지 배경 | 4.8 : 1 | 4.5 이상 ✅ |
| 메인색 링크 / 번갈이 섹션 배경 | 4.4 : 1 | ❌ → `.section-alt` 안 링크는 `--color-primary-strong` 자동 적용 |
| 오류색 자리표시자 / 연한 강조 배경 | 5.3 : 1 | 4.5 이상 ✅ |
| 포커스 테두리 / 번갈이 섹션 배경 | 5.5 : 1 | 3 이상 ✅ |
| 흰 글자 / 메인 버튼 | 5.0 : 1 | 4.5 이상 ✅ |
| 흰 글자 / 메인 버튼 hover | 6.7 : 1 | 4.5 이상 ✅ |
| 배지 글자 / 배지 배경 | 5.4 : 1 | 4.5 이상 ✅ |
| 입력창 테두리 / 흰 배경 | 3.9 : 1 | 3 이상 (UI 요소) ✅ |

- 위 표에 없는 조합을 새로 쓰면 대비를 확인하고 이 표에 추가한다.
- 색만으로 정보를 전달하지 않는다. (오류는 색 + 문구로 알린다)

## 3. 글꼴
- **Pretendard** 하나만 쓴다. 굵기는 **500, 700 두 가지만** 쓴다.
  - 500 (`--font-weight-regular`): 본문 기본
  - 700 (`--font-weight-bold`): 제목, 강조(`strong`), 버튼, 라벨
  - 300·400·600 등 다른 굵기는 쓰지 않는다. (`style.css`에 선언하지 않았으므로 브라우저가 가짜 굵기를 만든다)
- 불러오기: jsDelivr CDN의 woff2 파일 두 개를 `style.css`의 `@font-face`로 직접 선언한다. (팀 합의 완료)
- 글꼴을 못 불러오면 시스템 글꼴(Apple SD Gothic Neo, 맑은 고딕 등)로 표시된다.

### 글자 크기 — 화면 폭에 따라 자동으로 변함
| 변수 | 360px 화면 | 1200px 이상 | 쓰임 |
| --- | --- | --- | --- |
| `--font-size-h1` | 30px | 44px | 페이지 제목 (페이지당 1개) |
| `--font-size-h2` | 24px | 32px | 섹션 제목 |
| `--font-size-h3` | 20px | 24px | 소제목 |
| `--font-size-lg` | 18px | 20px | 리드 문장, 카드 제목 |
| `--font-size-md` | 16px | 17px | 본문 기본 |
| `--font-size-sm` | 14px | 15px | 힌트, 오류 문구, 캡션 |
| `--font-size-xs` | 12px | 13px | 배지 |

- 줄 높이: 제목 `--line-height-tight`(1.3), 본문 `--line-height-base`(1.7)
- 한글 단어가 중간에 끊기지 않도록 `word-break: keep-all`이 기본 적용되어 있다.
- 본문 글자는 16px보다 작게 만들지 않는다.

## 4. 반응형 원칙 — 브레이크포인트 없이

**고정 브레이크포인트(`@media (min-width: 768px)` 등)를 만들지 않는다.** 대신 아래 세 가지로 모든 폭에 대응한다.

### ① 크기는 `clamp()` 변수로
글자 크기와 큰 간격은 이미 `clamp()`로 정의되어 있으니 변수만 쓴다.
새 유동값이 필요하면 `clamp(최솟값, 기준값 + vw, 최댓값)` 형태로 `:root`에 추가한다.

```css
.hero-title {
  font-size: var(--font-size-h1);
  margin-bottom: var(--space-5);
}
```

### ② 열 수는 `auto-fit` 그리드로
카드 목록은 `.auto-grid`를 쓰면 화면 폭에 맞춰 1열 → 2열 → 3열로 자동 전환된다.
카드 최소 폭을 바꾸려면 `--grid-min`만 덮어쓴다.

```html
<ul class="auto-grid category-list">
  <li class="card">…</li>
</ul>
```
```css
/* css/service.css */
.category-list {
  --grid-min: 12rem; /* 카테고리 카드는 더 좁게 */
}
```

나란히 놓을 요소가 2~3개뿐이면 `flex-wrap: wrap` + `flex: 1 1 <최소폭>`도 쓸 수 있다.

### ③ 폭은 `max-width`로 제한
| 변수 | 값 | 쓰임 |
| --- | --- | --- |
| `--max-width-content` | 1200px | 페이지 콘텐츠 최대 폭 (`.container`) |
| `--max-width-text` | 68ch | 긴 글 한 줄 최대 길이 (`p`에 기본 적용) |

- 모든 콘텐츠는 `.container` 안에 넣는다. 좌우 여백은 `--space-gutter`(16 → 32px)로 자동 조절된다.
- `width`를 px로 고정하지 않는다. 필요하면 `max-width` + `width: 100%`를 쓴다.

### 예외
- `@media (prefers-reduced-motion: reduce)` 같은 **사용자 설정** 미디어쿼리는 쓸 수 있다.
- 위 세 방법으로 도저히 해결되지 않는 경우에만 팀과 상의해 미디어쿼리를 추가한다.

### 확인 방법
브라우저 창을 **320px부터 1440px까지 천천히 늘리며** 가로 스크롤, 글자 겹침, 지나치게 긴 줄이 없는지 본다.

## 5. 간격
4px 단위로 고정값을 쓰고, 섹션·여백처럼 큰 간격은 유동값을 쓴다.

| 변수 | 값 | | 변수 | 값 |
| --- | --- | --- | --- | --- |
| `--space-1` | 4px | | `--space-5` | 24px |
| `--space-2` | 8px | | `--space-6` | 32px |
| `--space-3` | 12px | | `--space-7` | 48px |
| `--space-4` | 16px | | `--space-8` | 64px |

| 유동 변수 | 범위 | 쓰임 |
| --- | --- | --- |
| `--space-gutter` | 16 → 32px | 페이지 좌우 여백 |
| `--space-section` | 48 → 96px | 섹션 위아래 여백 (`.section`) |
| `--space-gap` | 16 → 24px | 그리드·목록 간격 |

## 6. 모서리 · 그림자 · 움직임
| 변수 | 값 | 쓰임 |
| --- | --- | --- |
| `--radius-sm` | 6px | 입력창 |
| `--radius-md` | 12px | 카드 |
| `--radius-lg` | 20px | 큰 이미지·배너 |
| `--radius-pill` | 999px | 버튼, 배지 |
| `--shadow-sm` | 약한 그림자 | 카드 기본 |
| `--shadow-md` | 중간 그림자 | 강조 카드, hover |
| `--transition-base` | 0.2s ease | 색 변화 |

## 7. 공통 클래스 (`style.css`에 있음)
| 클래스 | 용도 |
| --- | --- |
| `.container` | 최대 폭 + 좌우 여백 |
| `.section` / `.section-alt` | 섹션 위아래 여백 / 번갈이 배경 |
| `.section-title`, `.section-lead` | 섹션 제목, 리드 문장 |
| `.auto-grid` | 자동 열 그리드 |
| `.stack` | 자식 요소 사이 세로 간격 |
| `.btn` + `.btn-primary` / `.btn-outline` | 버튼 (터치 영역 44px 이상) |
| `.card`, `.card-title`, `.card-text` | 카드 |
| `.badge` | 카테고리 등 작은 꼬리표 |
| `.form-field`, `.form-label`, `.form-input`, `.form-textarea`, `.form-select` | 폼 |
| `.form-required`, `.form-hint`, `.form-error`, `.form-success` | 필수 표시, 안내·오류·성공 문구 |
| `.placeholder-text` | 문서에 없는 정보 자리표시자 (예: `[주소 확인 필요]`) |
| `.visually-hidden` | 스크린리더 전용 텍스트 |

- 헤더·푸터는 `js/main.js`의 컴포넌트로 넣는다. 각 페이지 `body`에 `<site-header data-current="<페이지명>"></site-header>`와 `<site-footer></site-footer>`를 두고 `js/main.js`를 `defer`로 불러온다. 스타일은 `style.css`의 "6-1. 헤더·푸터"에 있다.
- 페이지 전용 스타일은 `css/<페이지명>.css`에 쓰고, 공통 클래스를 덮어쓰지 말고 새 클래스를 추가한다.

## 8. 접근성
- 키보드 포커스는 `:focus-visible`로 파란 테두리(`--color-focus`)가 보인다. `outline: none`으로 지우지 않는다.
- 버튼·링크·입력창의 터치 영역은 44px 이상으로 한다.
- 폼 오류는 입력창에 `aria-invalid="true"`를 주고, `.form-error` 문구를 `aria-describedby`로 연결한다.
- 이미지에는 `alt`를 넣는다. 장식용은 `alt=""`.

## 9. 이름 규칙
- 클래스: 소문자 kebab-case, `블록-요소` 형태 (`hero-title`, `card-list`, `category-item`)
- 변수: `--<분류>-<이름>` (`--color-primary`, `--space-4`, `--font-size-h2`)
- `id` 선택자 스타일링, `!important`, 인라인 `style` 금지
