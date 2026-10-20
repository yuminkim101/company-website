// 스타일 가이드: 현재 화면 폭과 유동 변수의 계산값을 표시한다.
const widthOutput = document.querySelector("[data-viewport-width]");
const sizeOutputs = document.querySelectorAll("[data-size-var]");
const probe = document.createElement("span");

probe.className = "visually-hidden";
document.body.append(probe);

function updateValues() {
  if (widthOutput) {
    widthOutput.textContent = window.innerWidth;
  }

  sizeOutputs.forEach((output) => {
    probe.style.width = `var(${output.dataset.sizeVar})`;
    output.textContent = `${Math.round(probe.getBoundingClientRect().width * 10) / 10}px`;
  });
}

window.addEventListener("resize", updateValues);
updateValues();
