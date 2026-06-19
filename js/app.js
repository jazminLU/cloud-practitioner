/* ─── Progress (localStorage) ──────────────────────────────────────────── */
const STORAGE_KEY = 'cp-clf-c02';

const Progress = {
  data: {},

  load() {
    try { this.data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { this.data = {}; }
  },

  save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data)); }
    catch {}
  },

  record(name, correct) {
    if (!this.data[name]) this.data[name] = { ok: 0, fail: 0 };
    correct ? this.data[name].ok++ : this.data[name].fail++;
    this.save();
  },

  get(name) {
    return this.data[name] || { ok: 0, fail: 0 };
  },

  masteredCount() {
    return Object.values(this.data).filter(d => d.ok >= 2 && d.fail === 0).length;
  },

  weakServices(minAttempts = 1) {
    return SERVICES.filter(s => {
      const d = this.data[s.name];
      return d && (d.ok + d.fail) >= minAttempts && d.fail > 0;
    }).sort((a, b) => {
      const da = this.data[a.name], db = this.data[b.name];
      const ra = da.fail / (da.ok + da.fail), rb = db.fail / (db.ok + db.fail);
      return rb - ra;
    });
  },

  reset() {
    this.data = {};
    this.save();
  },
};

/* ─── State ────────────────────────────────────────────────────────────── */
const State = {
  view: 'home',          // home | flashcards | quiz | results
  filter: 'all',         // 'all' or category key
  quizType: 'mixed',     // name2desc | desc2name | mixed
  weakOnly: false,

  fc: {
    list: [],
    index: 0,
    flipped: false,
  },

  quiz: {
    queue: [],
    current: null,
    correctIdx: -1,
    answered: false,
    ok: 0,
    fail: 0,
    catStats: {},        // { cat: { ok, total } }
  },
};

/* ─── Utilities ────────────────────────────────────────────────────────── */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getFiltered() {
  if (State.filter === 'all') return SERVICES;
  return SERVICES.filter(s => s.cat === State.filter);
}

function catColor(cat) {
  return (CATEGORIES[cat] || {}).color || '#8b949e';
}

function catLabel(cat) {
  return (CATEGORIES[cat] || {}).label || cat;
}

function pctClass(pct) {
  if (pct >= 80) return 'great';
  if (pct >= 60) return 'ok';
  return 'needs';
}

function pctBarColor(pct) {
  if (pct >= 80) return 'var(--green)';
  if (pct >= 60) return 'var(--yellow)';
  return 'var(--red)';
}

/* ─── Router ───────────────────────────────────────────────────────────── */
function navigate(view, opts = {}) {
  State.view = view;
  Object.assign(State, opts);

  // Update nav active state
  document.querySelectorAll('.nav-btn[data-view]').forEach(b => {
    b.classList.toggle('active', b.dataset.view === view);
  });

  const app = document.getElementById('app');
  app.innerHTML = '';

  const div = document.createElement('div');
  div.className = 'view';

  switch (view) {
    case 'home':       div.innerHTML = renderHome();       break;
    case 'flashcards': div.innerHTML = renderFlashcards(); break;
    case 'quiz':       div.innerHTML = renderQuizShell();  break;
    case 'results':    div.innerHTML = renderResults();    break;
  }

  app.appendChild(div);
  updateFooter(view);

  if (view === 'quiz') {
    initQuiz();
    setTimeout(() => showQuestion(), 0);
  }
}

/* ─── Footer keyboard hints ────────────────────────────────────────────── */
function updateFooter(view) {
  const footer = document.getElementById('footer-hints');
  const hints = {
    flashcards: [
      ['Space', 'Voltear'],
      ['←', 'Anterior'],
      ['→', 'Siguiente'],
      ['1', 'Lo sabía'],
      ['2', 'Regular'],
      ['3', 'No sabía'],
    ],
    quiz: [
      ['A B C D', 'Responder'],
      ['Enter', 'Siguiente'],
    ],
  };

  const list = hints[view] || [];
  footer.innerHTML = list.map(([k, v]) =>
    `<span class="kbd-hint"><kbd>${k}</kbd>${v}</span>`
  ).join('');
}

/* ─── HOME ──────────────────────────────────────────────────────────────── */
function renderHome() {
  const total = SERVICES.length;
  const mastered = Progress.masteredCount();
  const attempted = Object.keys(Progress.data).length;
  const weak = Progress.weakServices();
  const pct = attempted > 0 ? Math.round((mastered / total) * 100) : 0;

  const weakBanner = weak.length > 0 ? `
    <div class="weak-banner">
      <div class="weak-banner-icon">⚠️</div>
      <div class="weak-banner-text">
        Tenés <strong>${weak.length} servicio${weak.length > 1 ? 's' : ''} débil${weak.length > 1 ? 'es' : ''}</strong>
        que seguís errando. Te recomendamos repasar: ${weak.slice(0, 3).map(s => `<strong>${s.name}</strong>`).join(', ')}${weak.length > 3 ? '…' : ''}.
      </div>
      <button class="weak-study-btn" onclick="startWeakQuiz()">Practicar débiles</button>
    </div>
  ` : '';

  const catRows = Object.entries(CATEGORIES).map(([key, cat]) => {
    const count = SERVICES.filter(s => s.cat === key).length;
    return `
      <div class="cat-chip" onclick="navigateToCat('${key}')">
        <div class="cat-chip-left">
          <div class="cat-dot" style="background:${cat.color}"></div>
          <span class="cat-chip-label">${cat.label}</span>
        </div>
        <span class="cat-chip-count">${count}</span>
      </div>`;
  }).join('');

  return `
    <div class="home-hero">
      <h1>AWS Cloud Practitioner</h1>
      <p>Practica los ${total} servicios del examen CLF-C02 con flashcards y quiz de opción múltiple.</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${total}</div>
        <div class="stat-label">Servicios totales</div>
      </div>
      <div class="stat-card">
        <div class="stat-value green">${mastered}</div>
        <div class="stat-label">Dominados ✓</div>
      </div>
      <div class="stat-card">
        <div class="stat-value orange">${attempted}</div>
        <div class="stat-label">Estudiados</div>
      </div>
      <div class="stat-card">
        <div class="stat-value ${pct >= 70 ? 'green' : pct >= 40 ? 'orange' : 'red'}">${pct}%</div>
        <div class="stat-label">Progreso</div>
      </div>
    </div>

    ${weakBanner}

    <div class="home-modes">
      <button class="mode-card" onclick="navigate('flashcards')">
        <div class="mode-card-icon">🃏</div>
        <div class="mode-card-title">Flashcards</div>
        <div class="mode-card-desc">Repasá cada servicio a tu ritmo. Calificá si lo sabías para trackear tu progreso.</div>
        <span class="mode-card-tag">Estudio libre</span>
      </button>
      <button class="mode-card" onclick="navigate('quiz')">
        <div class="mode-card-icon">🎯</div>
        <div class="mode-card-title">Quiz</div>
        <div class="mode-card-desc">Opción múltiple. Elegí si querés identificar nombres, descripciones o modo mixto.</div>
        <span class="mode-card-tag">4 opciones</span>
      </button>
    </div>

    <div class="home-cats-title">Por categoría</div>
    <div class="cat-grid">${catRows}</div>

    ${attempted > 0 ? `
      <hr class="divider">
      <div style="text-align:center">
        <button class="btn-secondary" onclick="confirmReset()" style="font-size:12px;padding:7px 14px">
          Reiniciar progreso
        </button>
      </div>
    ` : ''}
  `;
}

function navigateToCat(cat) {
  State.filter = cat;
  navigate('flashcards');
}

function startWeakQuiz() {
  State.weakOnly = true;
  State.filter = 'all';
  navigate('quiz');
}

function confirmReset() {
  if (confirm('¿Reiniciar todo el progreso guardado?')) {
    Progress.reset();
    navigate('home');
  }
}

/* ─── FLASHCARDS ────────────────────────────────────────────────────────── */
function renderFlashcards() {
  initFC();

  const pills = buildPills();
  const s = State.fc.list[State.fc.index];

  return `
    <div class="page-title">Flashcards</div>
    <div class="page-subtitle">Click en la tarjeta para ver la descripción.</div>

    <div class="pill-bar" id="pill-bar">${pills}</div>

    <div class="progress-row">
      <div class="progress-track">
        <div class="progress-fill" id="fc-prog" style="width:${fcProgress()}%"></div>
      </div>
      <div class="progress-label" id="fc-prog-label">${State.fc.index + 1} / ${State.fc.list.length}</div>
    </div>

    <div class="fc-layout">
      <div class="fc-hint">
        <kbd>Space</kbd> voltear &nbsp;·&nbsp; <kbd>←</kbd><kbd>→</kbd> navegar
      </div>

      ${buildFlipCard(s)}

      <div class="fc-rating hidden" id="fc-rating">
        <button class="rating-btn knew"   onclick="rateFC(true, true)"  title="1">✓ Lo sabía</button>
        <button class="rating-btn unsure" onclick="rateFC(false, false)" title="2">~ Regular</button>
        <button class="rating-btn didnt"  onclick="rateFC(false, true)"  title="3">✗ No sabía</button>
      </div>

      <div class="fc-nav">
        <button class="icon-btn" id="fc-prev" onclick="fcNav(-1)" ${State.fc.index === 0 ? 'disabled' : ''}>←</button>
        <span class="fc-counter" id="fc-counter">${State.fc.index + 1} / ${State.fc.list.length}</span>
        <button class="icon-btn" id="fc-next" onclick="fcNav(1)" ${State.fc.index === State.fc.list.length - 1 ? 'disabled' : ''}>→</button>
        <button class="fc-shuffle-btn" onclick="shuffleFC()">⟳ Barajar</button>
      </div>
    </div>
  `;
}

function buildFlipCard(s) {
  const tips = s.tips && s.tips.length
    ? `<div class="fc-tips">${s.tips.map(t => `<div class="fc-tip">💡 ${t}</div>`).join('')}</div>`
    : '';

  return `
    <div class="flip-scene" id="flip-scene" onclick="flipFC()">
      <div class="flip-card" id="flip-card">
        <div class="flip-face flip-face-front">
          <span class="fc-cat-badge">${catLabel(s.cat)}</span>
          <div class="fc-side-label">Servicio AWS</div>
          <div class="fc-service-name">${s.name}</div>
          <div class="fc-service-short">${s.short}</div>
        </div>
        <div class="flip-face flip-face-back">
          <span class="fc-cat-badge">${catLabel(s.cat)}</span>
          <div class="fc-side-label">Descripción</div>
          <div class="fc-desc">${s.desc}</div>
          ${tips}
        </div>
      </div>
    </div>
  `;
}

function initFC() {
  const services = State.weakOnly
    ? Progress.weakServices()
    : getFiltered();

  if (services.length === 0) {
    State.filter = 'all';
  }

  State.fc.list = shuffle(services.length ? services : getFiltered());
  State.fc.index = 0;
  State.fc.flipped = false;
  State.weakOnly = false;
}

function fcProgress() {
  return ((State.fc.index + 1) / State.fc.list.length) * 100;
}

function flipFC() {
  State.fc.flipped = !State.fc.flipped;
  document.getElementById('flip-card').classList.toggle('flipped', State.fc.flipped);
  document.getElementById('fc-rating').classList.toggle('hidden', !State.fc.flipped);
}

function fcNav(dir) {
  const len = State.fc.list.length;
  State.fc.index = Math.max(0, Math.min(len - 1, State.fc.index + dir));
  State.fc.flipped = false;
  refreshFC();
}

function rateFC(known, recordIt) {
  if (recordIt) {
    Progress.record(State.fc.list[State.fc.index].name, known);
  }
  fcNav(1);
}

function shuffleFC() {
  State.fc.list = shuffle(State.fc.list);
  State.fc.index = 0;
  State.fc.flipped = false;
  refreshFC();
}

function refreshFC() {
  const s = State.fc.list[State.fc.index];
  const len = State.fc.list.length;

  // Replace the flip scene in-place without losing references to siblings
  const scene = document.getElementById('flip-scene');
  const tmp = document.createElement('div');
  tmp.innerHTML = buildFlipCard(s);
  scene.replaceWith(tmp.firstElementChild);

  document.getElementById('fc-rating').classList.add('hidden');
  document.getElementById('fc-prev').disabled = State.fc.index === 0;
  document.getElementById('fc-next').disabled = State.fc.index === len - 1;
  document.getElementById('fc-counter').textContent = `${State.fc.index + 1} / ${len}`;
  document.getElementById('fc-prog').style.width = fcProgress() + '%';
  document.getElementById('fc-prog-label').textContent = `${State.fc.index + 1} / ${len}`;
}

/* ─── QUIZ ──────────────────────────────────────────────────────────────── */
function renderQuizShell() {
  return `
    <div class="page-title">Quiz</div>
    <div class="page-subtitle">Elegí una opción para responder. Podés usar las teclas A B C D.</div>

    <div class="pill-bar" id="pill-bar">${buildPills()}</div>

    <div class="quiz-type-row" id="qtype-row">
      ${['mixed','name2desc','desc2name'].map(t => {
        const labels = { mixed: '🔀 Mixto', name2desc: 'Nombre → Descripción', desc2name: 'Descripción → Nombre' };
        return `<button class="qtype-btn ${State.quizType === t ? 'active' : ''}"
          onclick="setQuizType('${t}', this)">${labels[t]}</button>`;
      }).join('')}
    </div>

    <div class="score-row">
      Correctas: <span class="val ok" id="sc-ok">0</span>
      &nbsp;·&nbsp;
      Incorrectas: <span class="val fail" id="sc-fail">0</span>
      &nbsp;·&nbsp;
      Restantes: <span class="val" id="sc-left">–</span>
    </div>

    <div class="progress-row">
      <div class="progress-track">
        <div class="progress-fill" id="quiz-prog" style="width:0%"></div>
      </div>
      <div class="progress-label" id="quiz-prog-label">0%</div>
    </div>

    <div id="quiz-question-wrap"></div>
  `;
}

function initQuiz() {
  const services = State.weakOnly
    ? Progress.weakServices()
    : getFiltered();

  State.quiz.queue    = shuffle(services.length > 0 ? services : SERVICES);
  State.quiz.ok       = 0;
  State.quiz.fail     = 0;
  State.quiz.catStats = {};
  State.quiz.answered = false;
  State.quiz.current  = null;
  State.weakOnly      = false;
}

function setQuizType(type, btn) {
  State.quizType = type;
  document.querySelectorAll('.qtype-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  initQuiz();
  showQuestion();
}

function buildQuestionData(svc) {
  const type = State.quizType === 'mixed'
    ? (Math.random() > 0.5 ? 'name2desc' : 'desc2name')
    : State.quizType;

  const pool   = shuffle(SERVICES.filter(s => s.name !== svc.name));
  const wrongs = pool.slice(0, 3);

  let questionHTML, options;

  if (type === 'name2desc') {
    questionHTML = `¿Cuál es la descripción de <strong>${svc.name}</strong>?`;
    options = shuffle([
      { text: svc.desc,  correct: true,  svcName: svc.name },
      ...wrongs.map(s => ({ text: s.desc,  correct: false, svcName: s.name })),
    ]);
  } else {
    questionHTML = `¿Qué servicio corresponde a esta descripción?<br><br><em>"${svc.desc}"</em>`;
    options = shuffle([
      { text: svc.name,  correct: true,  svcName: svc.name },
      ...wrongs.map(s => ({ text: s.name,  correct: false, svcName: s.name })),
    ]);
  }

  return { questionHTML, options, correctIdx: options.findIndex(o => o.correct) };
}

function showQuestion() {
  if (State.quiz.queue.length === 0) {
    navigate('results');
    return;
  }

  State.quiz.current  = State.quiz.queue.shift();
  State.quiz.answered = false;

  const svc  = State.quiz.current;
  const { questionHTML, options, correctIdx } = buildQuestionData(svc);
  State.quiz.correctIdx = correctIdx;

  const done  = State.quiz.ok + State.quiz.fail;
  const total = done + State.quiz.queue.length + 1;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
  const letters = ['A', 'B', 'C', 'D'];

  // Update score bar
  const scLeft = document.getElementById('sc-left');
  const scOk   = document.getElementById('sc-ok');
  const scFail = document.getElementById('sc-fail');
  const prog   = document.getElementById('quiz-prog');
  const progLbl= document.getElementById('quiz-prog-label');
  if (scLeft)  scLeft.textContent  = State.quiz.queue.length;
  if (scOk)    scOk.textContent    = State.quiz.ok;
  if (scFail)  scFail.textContent  = State.quiz.fail;
  if (prog)    prog.style.width    = pct + '%';
  if (progLbl) progLbl.textContent = pct + '%';

  // Render question card fresh
  const wrap = document.getElementById('quiz-question-wrap');
  if (!wrap) return;

  wrap.innerHTML = `
    <div class="quiz-card">
      <div class="q-meta">
        <span class="q-meta-label">Pregunta ${done + 1} de ${total}</span>
        <span class="q-cat-badge" style="border-color:${catColor(svc.cat)};color:${catColor(svc.cat)}">${catLabel(svc.cat)}</span>
      </div>
      <div class="q-text">${questionHTML}</div>
      <div class="options">
        ${options.map((o, i) => `
          <button class="option" data-idx="${i}" data-correct="${o.correct}" onclick="answerQuiz(this)">
            <span class="opt-letter">${letters[i]}</span>
            <span>${o.text}</span>
          </button>
        `).join('')}
      </div>
      <div class="quiz-feedback" id="q-feedback"></div>
    </div>
    <button class="next-btn" id="next-btn" onclick="showQuestion()">Siguiente →</button>
  `;
}

function answerQuiz(btn) {
  if (State.quiz.answered) return;
  State.quiz.answered = true;

  const correct = btn.dataset.correct === 'true';
  const svc     = State.quiz.current;

  Progress.record(svc.name, correct);

  if (!State.quiz.catStats[svc.cat]) State.quiz.catStats[svc.cat] = { ok: 0, total: 0 };
  State.quiz.catStats[svc.cat].total++;
  if (correct) State.quiz.catStats[svc.cat].ok++;

  // Style all options
  document.querySelectorAll('.option').forEach((b, i) => {
    b.setAttribute('disabled', '');
    b.onclick = null;
    if (i === State.quiz.correctIdx) b.classList.add('correct');
  });

  if (!correct) {
    btn.classList.add('wrong');
    State.quiz.fail++;
  } else {
    State.quiz.ok++;
  }

  // Update score
  const scOk   = document.getElementById('sc-ok');
  const scFail = document.getElementById('sc-fail');
  if (scOk)   scOk.textContent   = State.quiz.ok;
  if (scFail) scFail.textContent = State.quiz.fail;

  // Feedback
  const tip = svc.tips && svc.tips.length
    ? `<div class="feedback-tip">${svc.tips[0]}</div>`
    : '';

  const fb = document.getElementById('q-feedback');
  if (fb) {
    if (correct) {
      fb.className = 'quiz-feedback ok show';
      fb.innerHTML = `✓ Correcto. <strong>${svc.name}</strong> — ${svc.short}.${tip}`;
    } else {
      fb.className = 'quiz-feedback bad show';
      fb.innerHTML = `✗ Incorrecto. La respuesta correcta es <strong>${svc.name}</strong> — ${svc.short}.<br><br>${svc.desc}${tip}`;
    }
  }

  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) {
    nextBtn.textContent = State.quiz.queue.length === 0 ? 'Ver resultado →' : 'Siguiente →';
    nextBtn.classList.add('show');
  }
}

/* ─── RESULTS ───────────────────────────────────────────────────────────── */
function renderResults() {
  const { ok, fail, catStats } = State.quiz;
  const total = ok + fail;
  const pct = total > 0 ? Math.round((ok / total) * 100) : 0;
  const cls = pctClass(pct);

  const msgs = {
    great: `¡Muy bien! ${pct >= 90 ? 'Prácticamente listo para el examen.' : 'Seguís en buen camino.'}`,
    ok:    'Vas bien, pero hay margen de mejora. Revisá las que erraste.',
    needs: 'Necesitás más práctica. No te rindas — seguí repasando.',
  };

  // Breakdown by category
  const breakdownRows = Object.entries(catStats)
    .map(([cat, st]) => {
      const p = Math.round((st.ok / st.total) * 100);
      return { cat, pct: p, ok: st.ok, total: st.total };
    })
    .sort((a, b) => a.pct - b.pct)
    .map(row => `
      <div class="breakdown-row">
        <div class="breakdown-cat">${catLabel(row.cat)}</div>
        <div class="breakdown-bar-wrap">
          <div class="breakdown-bar" style="width:${row.pct}%;background:${pctBarColor(row.pct)}"></div>
        </div>
        <div class="breakdown-score" style="color:${pctBarColor(row.pct)}">${row.pct}%</div>
      </div>
    `).join('');

  const weak = Progress.weakServices();

  return `
    <div class="results-card">
      <div class="results-title">Resultado del Quiz</div>
      <div class="results-pct ${cls}">${pct}%</div>
      <div class="results-msg">
        ${ok} correctas de ${total} preguntas.<br>${msgs[cls]}
      </div>

      ${breakdownRows ? `
        <div class="results-breakdown">
          <div class="breakdown-title">Por categoría</div>
          ${breakdownRows}
        </div>
      ` : ''}

      <div class="results-actions">
        <button class="btn-primary"   onclick="navigate('quiz')">Volver a intentar</button>
        <button class="btn-secondary" onclick="navigate('home')">Inicio</button>
        ${weak.length > 0 ? `<button class="btn-danger" onclick="startWeakQuiz()">Practicar ${weak.length} débiles</button>` : ''}
      </div>
    </div>
  `;
}

/* ─── Category pill bar ─────────────────────────────────────────────────── */
function buildPills() {
  const cats = [['all', 'Todos'], ...Object.entries(CATEGORIES).map(([k, v]) => [k, v.label])];
  return cats.map(([key, label]) => `
    <button class="pill ${State.filter === key ? 'active' : ''}"
      onclick="setFilter('${key}', this)">${label}</button>
  `).join('');
}

function setFilter(cat, btn) {
  State.filter = cat;
  document.querySelectorAll('.pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  if (State.view === 'flashcards') {
    initFC();
    State.fc.list = shuffle(getFiltered());
    State.fc.index = 0;
    State.fc.flipped = false;
    refreshFC();
    document.getElementById('fc-counter').textContent = `1 / ${State.fc.list.length}`;
    document.getElementById('fc-prog-label').textContent = `1 / ${State.fc.list.length}`;
    document.getElementById('fc-prev').disabled = true;
    document.getElementById('fc-next').disabled = State.fc.list.length <= 1;
  } else if (State.view === 'quiz') {
    initQuiz();
    showQuestion();
  }
}

/* ─── Keyboard shortcuts ────────────────────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  if (State.view === 'flashcards') {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flipFC(); }
    if (e.key === 'ArrowLeft')  fcNav(-1);
    if (e.key === 'ArrowRight') fcNav(1);
    if (e.key === '1') rateFC(true,  true);
    if (e.key === '2') rateFC(false, false);
    if (e.key === '3') rateFC(false, true);
  }

  if (State.view === 'quiz') {
    if (State.quiz.answered) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showQuestion();
      }
    } else {
      const map = { a: 0, b: 1, c: 2, d: 3 };
      const idx = map[e.key.toLowerCase()];
      if (idx !== undefined) {
        const btn = document.querySelectorAll('.option')[idx];
        if (btn) btn.click();
      }
    }
  }
});

/* ─── Bootstrap ─────────────────────────────────────────────────────────── */
Progress.load();
navigate('home');
