const KNEAD_GOAL = 10;
const BAKE_DURATION = 3000;

const ADDED_MESSAGES = {
  flour: '밀가루를 쏟아 산처럼 쌓았어요.',
  egg: '계란을 깨서 홈에 넣었어요.',
  butter: '버터를 홈에 쏙 넣었어요.',
  milk: '우유를 홈에 부었어요.',
};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const statusText = document.querySelector('[data-status]');
const ingredientButtons = document.querySelectorAll('[data-ingredient]');
const workbench = document.querySelector('[data-workbench]');
const flourMound = document.querySelector('[data-flour-mound]');
const flourWell = document.querySelector('[data-flour-well]');
const wellItems = {
  egg: document.querySelector('[data-well-item="egg"]'),
  butter: document.querySelector('[data-well-item="butter"]'),
  milk: document.querySelector('[data-well-item="milk"]'),
};
const kneadButton = document.querySelector('[data-knead-button]');
const kneadCount = document.querySelector('[data-knead-count]');
const dough = document.querySelector('[data-dough]');
const fists = {
  left: document.querySelector('[data-fist="left"]'),
  right: document.querySelector('[data-fist="right"]'),
};
const oven = document.querySelector('[data-oven]');
const ovenWindow = document.querySelector('[data-oven-window]');
const ovenContent = document.querySelector('[data-oven-content]');
const bakeProgress = document.querySelector('[data-bake-progress]');
const result = document.querySelector('[data-result]');
const resultBread = document.querySelector('[data-result-bread]');
const restartButton = document.querySelector('[data-restart]');

const addedIngredients = new Set();
let isBusy = false;
let kneadTimes = 0;

function setStatus(message) {
  statusText.textContent = message;
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, reduceMotion ? 0 : ms);
  });
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

// 애니메이션이 끝난 상태를 유지한다. (fill: forwards)
function play(element, keyframes, options) {
  const animation = element.animate(keyframes, {
    fill: 'forwards',
    easing: 'ease-in-out',
    ...options,
    duration: reduceMotion ? 1 : options.duration,
  });
  return animation.finished;
}

function getCenter(element) {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

// fromElement 중심이 toElement 중심에서 얼마나 떨어져 있는지 (px)
function offsetBetween(fromElement, toElement) {
  const from = getCenter(fromElement);
  const to = getCenter(toElement);
  return { x: from.x - to.x, y: from.y - to.y };
}

// 작업대 기준 좌표. fx, fy는 요소 안의 비율 위치 (0.5, 0.5 = 중심)
function benchPoint(element, fx = 0.5, fy = 0.5) {
  const bench = workbench.getBoundingClientRect();
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left - bench.left + rect.width * fx,
    y: rect.top - bench.top + rect.height * fy,
  };
}

/* 입자 효과 */

function spawnParticle(className, from, to, duration) {
  const particle = document.createElement('span');
  particle.className = `particle ${className}`;
  workbench.append(particle);

  particle
    .animate(
      [
        { transform: `translate(${from.x}px, ${from.y}px)`, opacity: 1 },
        { transform: `translate(${to.x}px, ${to.y}px)`, opacity: to.opacity ?? 1 },
      ],
      { duration, easing: to.easing ?? 'ease-in' }
    )
    .finished.then(() => particle.remove());
}

// 일정 시간 동안 입자를 계속 떨어뜨려 쏟아지는 모습을 만든다.
function pour(className, getFrom, getTo, totalMs, intervalMs) {
  if (reduceMotion) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const startTime = performance.now();
    const timer = setInterval(() => {
      if (performance.now() - startTime > totalMs) {
        clearInterval(timer);
        resolve();
        return;
      }
      spawnParticle(className, getFrom(), getTo(), 450);
    }, intervalMs);
  });
}

// 한 지점에서 위쪽으로 흩어지는 밀가루 가루
function puffFlour(point, count, distance) {
  if (reduceMotion) {
    return;
  }

  for (let i = 0; i < count; i += 1) {
    const angle = randomBetween(-Math.PI, 0);
    const reach = randomBetween(distance * 0.4, distance);
    spawnParticle(
      'is-flour',
      point,
      {
        x: point.x + Math.cos(angle) * reach,
        y: point.y + Math.sin(angle) * reach,
        opacity: 0,
        easing: 'ease-out',
      },
      randomBetween(450, 750)
    );
  }
}

/* 재료 소품 */

function createProp(className, partClassNames) {
  const prop = document.createElement('div');
  prop.className = `prop ${className}`;
  prop.setAttribute('aria-hidden', 'true');

  partClassNames.forEach((partClassName) => {
    const part = document.createElement('span');
    part.className = partClassName;
    prop.append(part);
  });

  workbench.append(prop);
  return prop;
}

function bringProp(prop, sourceButton) {
  const from = offsetBetween(sourceButton.querySelector('.ingredient-icon'), prop);
  return play(
    prop,
    [
      { transform: `translate(${from.x}px, ${from.y}px) scale(0.5)`, opacity: 0.6 },
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
    ],
    { duration: 600 }
  );
}

async function takeAwayProp(prop, transform) {
  await play(
    prop,
    [
      { transform, opacity: 1 },
      { transform: `translateY(-1rem) ${transform}`, opacity: 0 },
    ],
    { duration: 350 }
  );
  prop.remove();
}

/* 재료별 연출 */

async function pourFlour(button) {
  const bag = createProp('prop-flour-bag', ['prop-label', 'prop-mouth']);
  bag.querySelector('.prop-label').textContent = '밀가루';
  await bringProp(bag, button);

  const tilt = 'rotate(-120deg)';
  await play(bag, [{ transform: 'rotate(0deg)' }, { transform: tilt }], { duration: 400 });

  flourMound.hidden = false;
  const left = benchPoint(flourMound, 0.3).x;
  const right = benchPoint(flourMound, 0.7).x;
  const top = benchPoint(flourMound, 0.5, 0.1).y;
  const middle = benchPoint(flourMound, 0.5, 0.6).y;
  const mouth = bag.querySelector('.prop-mouth');

  await Promise.all([
    play(
      flourMound,
      [{ transform: 'scale(0.3, 0)' }, { transform: 'scale(1, 1)' }],
      { duration: 1400, easing: 'ease-out' }
    ),
    pour(
      'is-flour',
      () => {
        const point = benchPoint(mouth);
        return { x: point.x + randomBetween(-5, 5), y: point.y + randomBetween(-3, 3) };
      },
      () => ({ x: randomBetween(left, right), y: randomBetween(top, middle) }),
      1300,
      8
    ),
  ]);

  await takeAwayProp(bag, tilt);
}

async function digWell() {
  flourWell.hidden = false;
  puffFlour(benchPoint(flourWell), 10, 35);
  await play(
    flourWell,
    [{ transform: 'scale(0)' }, { transform: 'scale(1)' }],
    { duration: 450, easing: 'ease-out' }
  );
}

async function crackEgg(button) {
  const egg = createProp('prop-egg', ['egg-shell is-left', 'egg-shell is-right']);
  await bringProp(egg, button);

  await play(
    egg,
    [
      { transform: 'rotate(0deg)' },
      { transform: 'rotate(-12deg)' },
      { transform: 'rotate(12deg)' },
      { transform: 'rotate(0deg)' },
    ],
    { duration: 400 }
  );

  const [leftShell, rightShell] = egg.children;
  const contents = wellItems.egg;
  contents.hidden = false;
  const from = offsetBetween(egg, contents);

  await Promise.all([
    play(
      leftShell,
      [{ transform: 'none' }, { transform: 'translate(-0.9em, -0.3em) rotate(-40deg)' }],
      { duration: 350 }
    ),
    play(
      rightShell,
      [{ transform: 'none' }, { transform: 'translate(0.9em, -0.3em) rotate(40deg)' }],
      { duration: 350 }
    ),
    play(
      contents,
      [
        { transform: `translate(${from.x}px, ${from.y}px) scale(0.4, 0.8)`, opacity: 0 },
        { transform: `translate(${from.x}px, ${from.y}px) scale(0.4, 0.8)`, opacity: 1, offset: 0.3 },
        { transform: 'translate(0, 0) scale(1.15, 0.85)', opacity: 1, offset: 0.85 },
        { transform: 'translate(0, 0) scale(1, 1)', opacity: 1 },
      ],
      { duration: 750, easing: 'ease-in' }
    ),
  ]);

  await takeAwayProp(egg, 'rotate(0deg)');
}

async function dropButter(button) {
  const butter = wellItems.butter;
  butter.hidden = false;
  const from = offsetBetween(button.querySelector('.ingredient-icon'), butter);
  const peakY = Math.min(from.y, 0) - 60;

  await play(
    butter,
    [
      { transform: `translate(${from.x}px, ${from.y}px) rotate(0deg) scale(1.6)` },
      { transform: `translate(${from.x / 2}px, ${peakY}px) rotate(180deg) scale(1.3)`, offset: 0.5 },
      { transform: 'translate(0, 0) rotate(360deg) scale(1, 1)', offset: 0.85 },
      { transform: 'translate(0, 0) rotate(360deg) scale(1.25, 0.7)', offset: 0.93 },
      { transform: 'translate(0, 0) rotate(360deg) scale(1, 1)' },
    ],
    { duration: 900 }
  );
}

async function pourMilk(button) {
  const glass = createProp('prop-glass', ['glass-milk', 'prop-mouth']);
  await bringProp(glass, button);

  const tilt = 'rotate(-75deg)';
  await play(glass, [{ transform: 'rotate(0deg)' }, { transform: tilt }], { duration: 400 });

  const milk = wellItems.milk;
  milk.hidden = false;
  const target = benchPoint(milk);
  const mouth = glass.querySelector('.prop-mouth');

  await Promise.all([
    play(milk, [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 1200, easing: 'ease-out' }),
    play(
      glass.querySelector('.glass-milk'),
      [{ transform: 'scaleY(1)' }, { transform: 'scaleY(0.1)' }],
      { duration: 1200 }
    ),
    pour(
      'is-milk',
      () => benchPoint(mouth),
      () => ({ x: target.x + randomBetween(-3, 3), y: target.y }),
      1100,
      12
    ),
  ]);

  await takeAwayProp(glass, tilt);
}

const INGREDIENT_ACTIONS = {
  flour: pourFlour,
  egg: crackEgg,
  butter: dropButter,
  milk: pourMilk,
};

/* 재료 담기 */

// 밀가루를 먼저 넣어야 나머지 재료를 고를 수 있다.
function refreshIngredientButtons() {
  ingredientButtons.forEach((button) => {
    const key = button.dataset.ingredient;
    const isAdded = addedIngredients.has(key);
    const needsFlour = key !== 'flour' && !addedIngredients.has('flour');

    button.classList.toggle('is-used', isAdded);
    button.disabled = isBusy || isAdded || needsFlour;
  });
}

async function addIngredient(button) {
  const key = button.dataset.ingredient;

  if (isBusy || addedIngredients.has(key)) {
    return;
  }

  isBusy = true;
  refreshIngredientButtons();

  if (key !== 'flour' && flourWell.hidden) {
    setStatus('밀가루 가운데에 홈을 파요.');
    await digWell();
  }

  await INGREDIENT_ACTIONS[key](button);

  addedIngredients.add(key);
  isBusy = false;
  refreshIngredientButtons();

  const remaining = ingredientButtons.length - addedIngredients.size;

  if (remaining > 0) {
    setStatus(`${ADDED_MESSAGES[key]} 남은 재료 ${remaining}개.`);
    [...ingredientButtons].find((ingredientButton) => !ingredientButton.disabled)?.focus();
    return;
  }

  setStatus(`${ADDED_MESSAGES[key]} 재료가 모두 모였어요. 반죽하기 버튼을 눌러 주세요.`);
  kneadButton.hidden = false;
  kneadButton.focus();
}

/* 반죽 */

async function startKneading() {
  if (isBusy || addedIngredients.size < ingredientButtons.length) {
    return;
  }

  isBusy = true;
  kneadButton.hidden = true;
  setStatus('재료를 한데 모아 반죽을 만들어요.');

  puffFlour(benchPoint(flourMound, 0.5, 0.3), 14, 50);
  await play(
    flourMound,
    [
      { transform: 'scale(1, 1)', opacity: 1 },
      { transform: 'scale(0.5, 0.4)', opacity: 0 },
    ],
    { duration: 600, easing: 'ease-in' }
  );
  flourMound.hidden = true;

  dough.hidden = false;
  fists.left.hidden = false;
  fists.right.hidden = false;
  kneadCount.hidden = false;
  kneadCount.textContent = `0 / ${KNEAD_GOAL}`;
  await play(
    dough,
    [{ transform: 'scale(0.4)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }],
    { duration: 400, easing: 'ease-out', fill: 'none' }
  );

  isBusy = false;
  dough.focus();
  setStatus(`반죽을 눌러 양쪽 주먹으로 ${KNEAD_GOAL}번 두드려 주세요.`);
}

function punchDough() {
  if (kneadTimes >= KNEAD_GOAL) {
    return;
  }

  kneadTimes += 1;
  kneadCount.textContent = `${kneadTimes} / ${KNEAD_GOAL}`;

  if (!reduceMotion) {
    // offset 값은 transform의 영향을 받지 않아 연타 중에도 거리가 일정하다.
    const doughLeft = dough.offsetLeft;
    const doughRight = dough.offsetLeft + dough.offsetWidth;
    const doughMiddle = dough.offsetTop + dough.offsetHeight / 2;
    const leftReach = doughLeft - (fists.left.offsetLeft + fists.left.offsetWidth) + 10;
    const rightReach = doughRight - fists.right.offsetLeft - 10;

    fists.left.animate(
      [
        { transform: 'translateX(0)' },
        { transform: `translateX(${leftReach}px)`, offset: 0.45 },
        { transform: 'translateX(0)' },
      ],
      { duration: 280, easing: 'ease-in-out' }
    );
    fists.right.animate(
      [
        { transform: 'translateX(0)' },
        { transform: `translateX(${rightReach}px)`, offset: 0.45 },
        { transform: 'translateX(0)' },
      ],
      { duration: 280, easing: 'ease-in-out' }
    );
    dough.animate(
      [
        { transform: 'scale(1, 1)' },
        { transform: 'scale(0.78, 1.15)', offset: 0.5 },
        { transform: 'scale(1, 1)' },
      ],
      { duration: 300, delay: 80, easing: 'ease-out' }
    );

    setTimeout(() => {
      puffFlour({ x: doughLeft, y: doughMiddle }, 12, 60);
      puffFlour({ x: doughRight, y: doughMiddle }, 12, 60);
    }, 120);
  }

  if (kneadTimes === Math.ceil(KNEAD_GOAL / 2)) {
    dough.classList.add('is-smooth');
  }

  if (kneadTimes < KNEAD_GOAL) {
    setStatus(`퍽퍽! 반죽을 ${KNEAD_GOAL - kneadTimes}번 더 두드려 주세요.`);
    return;
  }

  finishKneading();
}

/* 굽기 */

// 시작 요소에서 목표 요소까지 포물선을 그리며 날아가는 요소를 만든다.
function flyTo(fromElement, toElement, flyingItem) {
  const start = getCenter(fromElement);
  const end = getCenter(toElement);
  const peakY = Math.min(start.y, end.y) - 80;

  flyingItem.classList.add('flying-item');
  document.body.append(flyingItem);

  const halfWidth = flyingItem.offsetWidth / 2;
  const halfHeight = flyingItem.offsetHeight / 2;
  const toTransform = (x, y, scale) =>
    `translate(${x - halfWidth}px, ${y - halfHeight}px) scale(${scale})`;

  const animation = flyingItem.animate(
    [
      { transform: toTransform(start.x, start.y, 1) },
      { transform: toTransform((start.x + end.x) / 2, peakY, 1.2) },
      { transform: toTransform(end.x, end.y, 0.9) },
    ],
    { duration: reduceMotion ? 1 : 550, easing: 'ease-in-out' }
  );

  return animation.finished.then(() => flyingItem.remove());
}

async function finishKneading() {
  dough.disabled = true;
  setStatus('반죽 완성! 오븐에 넣을게요.');
  await wait(700);

  fists.left.hidden = true;
  fists.right.hidden = true;
  kneadCount.hidden = true;

  const flyingDough = document.createElement('span');
  flyingDough.classList.add('is-dough');
  const flight = flyTo(dough, ovenWindow, flyingDough);
  dough.hidden = true;
  await flight;

  bake();
}

function bake() {
  ovenContent.classList.add('is-dough');
  oven.classList.add('is-baking');
  bakeProgress.hidden = false;
  bakeProgress.value = 0;
  setStatus('오븐에서 빵을 굽는 중이에요...');

  const duration = reduceMotion ? 1000 : BAKE_DURATION;
  const startTime = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    bakeProgress.value = Math.round(progress * 100);

    if (progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    finishBaking();
  };

  requestAnimationFrame(tick);
}

// 오븐에서 꺼낸 빵이 화면 중앙으로 커지며 나오고, 도착하면 김이 피어오른다.
async function finishBaking() {
  oven.classList.remove('is-baking');
  bakeProgress.hidden = true;
  ovenContent.classList.remove('is-dough');
  setStatus('빵이 완성됐어요!');

  result.hidden = false;
  const from = offsetBetween(ovenWindow, resultBread);
  await play(
    resultBread,
    [
      { transform: `translate(${from.x}px, ${from.y}px) scale(0.15)`, opacity: 0.4 },
      { transform: 'translate(0, 0) scale(1.08)', opacity: 1, offset: 0.8 },
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
    ],
    { duration: 800, easing: 'ease-out' }
  );

  result.classList.add('is-steaming');
  restartButton.focus();
}

function resetGame() {
  addedIngredients.clear();
  isBusy = false;
  kneadTimes = 0;

  workbench.querySelectorAll('.prop, .particle').forEach((element) => element.remove());
  workbench.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
  flourMound.hidden = true;
  flourWell.hidden = true;
  Object.values(wellItems).forEach((item) => {
    item.hidden = true;
  });

  dough.disabled = false;
  dough.classList.remove('is-smooth');
  ovenContent.className = 'oven-content';
  kneadButton.hidden = true;
  result.hidden = true;
  result.classList.remove('is-steaming');
  resultBread.getAnimations().forEach((animation) => animation.cancel());

  refreshIngredientButtons();
  setStatus('먼저 밀가루를 눌러 작업대에 쏟아 주세요.');
  ingredientButtons[0].focus();
}

ingredientButtons.forEach((button) => {
  button.addEventListener('click', () => addIngredient(button));
});
kneadButton.addEventListener('click', startKneading);
dough.addEventListener('click', punchDough);
restartButton.addEventListener('click', resetGame);
