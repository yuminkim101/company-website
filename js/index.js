// 회사 소개 — 숫자가 화면에 보이면 0에서 올라가며 멈춘다.
// 마지막 숫자는 HTML에 적힌 값과 같고, JS가 꺼져 있거나 움직임 줄이기 설정이면 처음부터 그 값이 보인다.

const COUNT_DURATION_MS = 1400;

const counters = document.querySelectorAll('[data-count-to]');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const runCounter = (element) => {
  const target = Number(element.dataset.countTo);
  const startTime = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - startTime) / COUNT_DURATION_MS, 1);
    element.textContent = Math.round(target * easeOutCubic(progress));
    if (progress < 1) requestAnimationFrame(tick);
  };

  element.textContent = 0;
  requestAnimationFrame(tick);
};

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      runCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.6 });

  counters.forEach((counter) => observer.observe(counter));
}
