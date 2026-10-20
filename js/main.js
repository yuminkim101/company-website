// 공통 헤더·푸터 컴포넌트
// 사용법: <site-header data-current="index"></site-header>, <site-footer></site-footer>
// data-current 값(index · service · location)에 해당하는 메뉴에 aria-current="page"를 붙인다.

const navItems = [
  { page: "index", href: "index.html", label: "회사 소개" },
  { page: "service", href: "service.html", label: "서비스 소개" },
  { page: "location", href: "location.html", label: "오시는 길" },
];

class SiteHeader extends HTMLElement {
  connectedCallback() {
    const current = this.dataset.current;
    const links = navItems
      .map((item) => {
        const ariaCurrent = item.page === current ? ' aria-current="page"' : "";
        return `<li><a class="nav-link" href="${item.href}"${ariaCurrent}>${item.label}</a></li>`;
      })
      .join("");

    this.innerHTML = `
      <header class="site-header">
        <div class="container header-inner">
          <a class="site-logo" href="index.html">클래스로</a>
          <nav aria-label="주요 메뉴">
            <ul class="nav-list">${links}</ul>
          </nav>
        </div>
      </header>`;
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    // 주소·연락처는 00_회사소개.md에 없어 기재하지 않는다. (TODO: 확인 필요)
    this.innerHTML = `
      <footer class="site-footer">
        <div class="container stack">
          <p class="footer-name">클래스로!(Classro)</p>
          <p>이 사이트는 수업용 가상 회사 설정으로 만든 예시 홈페이지입니다. 등장하는 회사·인물·수치는 실제와 무관합니다.</p>
        </div>
      </footer>`;
  }
}

customElements.define("site-header", SiteHeader);
customElements.define("site-footer", SiteFooter);
