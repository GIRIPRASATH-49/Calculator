// ── State ──────────────────────────────────────────
const state = {
  current:    '0',   // number being typed
  previous:   '',    // number before operator
  operator:   null,  // pending operator
  justEvaled: false, // did we just hit "="?
};

// ── DOM refs ───────────────────────────────────────
const resultEl    = document.getElementById('result');
const expressionEl = document.getElementById('expression');

// ── Helpers ────────────────────────────────────────
function updateDisplay() {
  // shrink font if the number is long
  const len = state.current.length;
  resultEl.style.fontSize = len > 9 ? '32px' : len > 7 ? '40px' : '52px';
  resultEl.textContent = formatNumber(state.current);
}

function formatNumber(str) {
  if (str === 'Error') return str;
  const [int, dec] = str.split('.');
  const formatted = parseInt(int, 10).toLocaleString('en-US');
  return dec !== undefined ? `${formatted}.${dec}` : formatted;
}

function popAnimation() {
  resultEl.classList.remove('pop');
  void resultEl.offsetWidth; // reflow
  resultEl.classList.add('pop');
  setTimeout(() => resultEl.classList.remove('pop'), 150);
}

function setExpression(text) {
  expressionEl.textContent = text;
}

// ── Core logic ─────────────────────────────────────
function calculate(a, op, b) {
  const x = parseFloat(a), y = parseFloat(b);
  switch (op) {
    case '+': return x + y;
    case '-': return x - y;
    case '*': return x * y;
    case '/': return y === 0 ? 'Error' : x / y;
    default: return b;
  }
}

function handleNumber(value) {
  if (state.justEvaled) {
    // start fresh after "="
    state.current = value;
    state.justEvaled = false;
  } else {
    state.current = state.current === '0'
      ? value
      : state.current + value;
  }
  updateDisplay();
}

function handleDecimal() {
  if (state.justEvaled) {
    state.current = '0.';
    state.justEvaled = false;
  } else if (!state.current.includes('.')) {
    state.current += '.';
  }
  updateDisplay();
}

function handleOperator(op) {
  // clear active state on all operator buttons
  document.querySelectorAll('.btn.operator').forEach(b => b.classList.remove('active'));

  if (state.operator && !state.justEvaled) {
    // chain: evaluate pending operation first
    const result = calculate(state.previous, state.operator, state.current);
    state.current = String(result === 'Error' ? 'Error' : +result.toFixed(10));
    updateDisplay();
    setExpression(`${formatNumber(state.previous)} ${opSymbol(state.operator)} ${formatNumber(state.current)} ${opSymbol(op)}`);
  } else {
    setExpression(`${formatNumber(state.current)} ${opSymbol(op)}`);
  }

  state.previous = state.current;
  state.operator  = op;
  state.justEvaled = false;
  state.current   = '0';

  // highlight active operator button
  const activeBtn = document.querySelector(`.btn.operator[data-value="${op}"]`);
  if (activeBtn) activeBtn.classList.add('active');
}

function handleEquals() {
  if (!state.operator) return;

  document.querySelectorAll('.btn.operator').forEach(b => b.classList.remove('active'));

  const result = calculate(state.previous, state.operator, state.current);
  const resultStr = result === 'Error' ? 'Error' : String(+parseFloat(result).toFixed(10));

  setExpression(`${formatNumber(state.previous)} ${opSymbol(state.operator)} ${formatNumber(state.current)} =`);
  state.current    = resultStr;
  state.operator   = null;
  state.previous   = '';
  state.justEvaled = true;

  updateDisplay();
  popAnimation();
}

function handleClear() {
  state.current    = '0';
  state.previous   = '';
  state.operator   = null;
  state.justEvaled = false;
  document.querySelectorAll('.btn.operator').forEach(b => b.classList.remove('active'));
  setExpression('');
  updateDisplay();
}

function handleSign() {
  if (state.current === '0' || state.current === 'Error') return;
  state.current = state.current.startsWith('-')
    ? state.current.slice(1)
    : '-' + state.current;
  updateDisplay();
}

function handlePercent() {
  if (state.current === 'Error') return;
  state.current = String(parseFloat(state.current) / 100);
  updateDisplay();
}

function opSymbol(op) {
  return { '+': '+', '-': '−', '*': '×', '/': '÷' }[op] || op;
}

// ── Event delegation ───────────────────────────────
document.querySelector('.buttons').addEventListener('click', e => {
  const btn = e.target.closest('.btn');
  if (!btn) return;

  const action = btn.dataset.action;
  const value  = btn.dataset.value;

  switch (action) {
    case 'number':   handleNumber(value);   break;
    case 'decimal':  handleDecimal();       break;
    case 'operator': handleOperator(value); break;
    case 'equals':   handleEquals();        break;
    case 'clear':    handleClear();         break;
    case 'sign':     handleSign();          break;
    case 'percent':  handlePercent();       break;
  }
});

// ── Cursor ripple on buttons ────────────────────────
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    btn.style.setProperty('--x', `${e.clientX - rect.left}px`);
    btn.style.setProperty('--y', `${e.clientY - rect.top}px`);
  });
});

// ── Keyboard support ───────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key >= '0' && e.key <= '9') handleNumber(e.key);
  else if (e.key === '.') handleDecimal();
  else if (['+', '-', '*', '/'].includes(e.key)) handleOperator(e.key);
  else if (e.key === 'Enter' || e.key === '=') handleEquals();
  else if (e.key === 'Escape') handleClear();
  else if (e.key === 'Backspace') {
    if (state.current.length > 1) {
      state.current = state.current.slice(0, -1);
    } else {
      state.current = '0';
    }
    updateDisplay();
  }
});

// ── Init ───────────────────────────────────────────
updateDisplay();