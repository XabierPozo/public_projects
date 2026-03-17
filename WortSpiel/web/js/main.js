// API PHP URL
const API_URL = '../php/api.php';

// ── Game state ───────────────────────────────────────────────
let cards = [], flipped = [], matched = new Set();
let moves = 0, startTime = null, timerInterval = null;
let locked = false, totalPairs = 0;

// ── DOM refs ─────────────────────────────────────────────────
const board       = document.getElementById('board');
const statsBar    = document.getElementById('stats-bar');
const progressWrap= document.getElementById('progress-wrap');
const progressBar = document.getElementById('progress-bar');
const sMoves      = document.getElementById('s-moves');
const sMatched    = document.getElementById('s-matched');
const sTimer      = document.getElementById('s-timer');
const overlay     = document.getElementById('overlay');
const wMoves      = document.getElementById('w-moves');
const wTime       = document.getElementById('w-time');
const countSel    = document.getElementById('count-sel');

// ── Helpers ──────────────────────────────────────────────────
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function fmtTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function getRandomSubset(arr, n) {
  return shuffle([...arr]).slice(0, n);
}

// ── API / data fetch ─────────────────────────────────────────
async function fetchPairs(count) {
  try {
    const res = await fetch(`${API_URL}?action=pairs&count=${count}`);
    if (!res.ok) throw new Error("Error en el servidor API");
    
    const data = await res.json();
    if (data.success) {
      console.log("API in operation");
      return data.pairs;
    }
    throw new Error(data.error);
  } catch (e) {
    console.error("API failure", e);
  }
}

// ── Build board ──────────────────────────────────────────────
function buildBoard(pairs) {
  totalPairs = pairs.length;

  // Determine columns according to the number of cards (×2)
  const total = totalPairs * 2;
  let cols;
  if (total <= 8) {
    cols = 4;
  } else if (total <= 12){
    cols = 4;
  } else if (total <= 16){
    cols = 4;
  } else if (total <= 24){
    cols = 6;
  } else {
    cols = 8;
  }
  board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  // Create cards: one DE + one ES per pair, shuffled
  const cardDefs = [];
  pairs.forEach(p => {
    cardDefs.push({ id: p.id, lang: 'de', word: p.aleman });
    cardDefs.push({ id: p.id, lang: 'es', word: p.espanol });
  });
  shuffle(cardDefs);

  cards = [];
  board.innerHTML = '';

  cardDefs.forEach((def, idx) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.idx  = idx;
    card.dataset.id   = def.id;
    card.dataset.lang = def.lang;

    // Dynamic height based on the number of columns
    const cellHeight = cols >= 6 ? '80px' : '95px';

    card.innerHTML = `
          <div class="card-inner" style="height:${cellHeight}">
            <div class="card-face card-back-face"></div>
            <div class="card-face card-front-face">
              <span class="card-lang-tag">${def.lang === 'de' ? '🇩🇪 DE' : '🇪🇸 ES'}</span>
              <span class="card-word">${def.word}</span>
            </div>
          </div>`;

    card.addEventListener('click', onCardClick);
    board.appendChild(card);
    cards.push(card);
  });

  // Entrance animation
  cards.forEach((c, i) => {
    c.style.opacity = '0';
    c.style.transform = 'scale(0.85)';
    c.style.transition = `opacity 0.3s ${i * 0.03}s, transform 0.3s ${i * 0.03}s`;
    requestAnimationFrame(() => {
      c.style.opacity = '1';
      c.style.transform = 'scale(1)';

    })  
  });
}

// ── Game logic ───────────────────────────────────────────────
function onCardClick(e) {
  const card = e.currentTarget;
  if (locked) {
    return;
  }
  if (card.classList.contains('flipped') || card.classList.contains('matched')) {
    return;
  }
  if (flipped.length >= 2) {
    return;
  }

  card.classList.add('flipped');
  flipped.push(card);

  if (flipped.length === 2) {
    moves++;
    sMoves.textContent = moves;
    checkMatch();
  }
}

function checkMatch() {
  const [a, b] = flipped;
  if (a.dataset.id === b.dataset.id && a.dataset.lang !== b.dataset.lang) {
  // ✅ Match
    setTimeout(() => {
      a.classList.add('matched');
      b.classList.add('matched');
      a.classList.remove('flipped');
      b.classList.remove('flipped');
      matched.add(a.dataset.id);
      flipped = [];
      updateStats();
      if (matched.size === totalPairs) endGame();
    }, 500);
  } else {
  // ❌ No match
    locked = true;
    a.classList.add('error');
    b.classList.add('error');
    setTimeout(() => {
      a.classList.remove('flipped', 'error');
      b.classList.remove('flipped', 'error');
      flipped = [];
      locked = false;
    }, 900);
  }
}

function updateStats() {
  sMatched.textContent = matched.size;
  progressBar.style.width = `${(matched.size / totalPairs) * 100}%`;
}

function startTimer() {
  startTime = Date.now();
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    sTimer.textContent = fmtTime(elapsed);
  }, 1000);
}

function endGame() {
  clearInterval(timerInterval);
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  wMoves.textContent = moves;
  wTime.textContent  = fmtTime(elapsed);
  setTimeout(() => overlay.classList.add('active'), 400);
}

// ── Start new game ───────────────────────────────────────────
async function startGame() {
  clearInterval(timerInterval);
  overlay.classList.remove('active');
  flipped = [];
  matched.clear();
  moves = 0;
  locked = false;

  board.innerHTML = `
    <div class="state-msg" style="grid-column:1/-1">
      <div class="dot-loader"><span></span><span></span><span></span></div>
      <p>Cargando verbos…</p>
    </div>`;

  const count = parseInt(countSel.value);

  try {
    const pairs = await fetchPairs(count);
    buildBoard(pairs);

  // Show UI
    statsBar.style.display = 'flex';
    progressWrap.style.display = 'block';
    sMoves.textContent   = '0';
    sMatched.textContent = '0';
    sTimer.textContent   = '0:00';
    progressBar.style.width = '0%';

    startTimer();
  } catch (err) {
    board.innerHTML = `<div class="state-msg" style="grid-column:1/-1"><p>❌ Error al cargar: ${err.message}</p></div>`;
  }
}

// ── Events ───────────────────────────────────────────────────
document.getElementById('btn-start').addEventListener('click', startGame);
document.getElementById('btn-again').addEventListener('click', startGame);
document.getElementById('btn-close').addEventListener('click', () => overlay.classList.remove('active'));
