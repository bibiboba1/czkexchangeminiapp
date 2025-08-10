console.log('[payment] v8 loaded');

// До 10 реквизитов
const REQUISITES = [
  { bank: "Сбербанк",      card: "2200 7001 1234 4321", phone: "+7 952 51 55 329", recipient: "Владимир Путин",     max_amount: 100000 },
  { bank: "Т-Банк",        card: "5536 9100 1122 3344", phone: "+7 951 797 44 88",  recipient: "Наталья Ковалева",  max_amount: 200000 },
  { bank: "ВТБ банк",      card: "4276 3200 5566 7788", phone: "+7 932 551 99 88",  recipient: "Всеволод Рублев",   max_amount: 300000 },
  { bank: "Райфайзен банк",card: "2200 7001 9876 5432", phone: "+7 900 000 00 00",  recipient: "Валентина Матвиенко", max_amount: 500000 },
];

/* ---------- utils ---------- */
function parseAmountRaw(v){
  if (v == null) return NaN;
  const cleaned = String(v).replace(/\u202F|\u00A0|\s/g,'').replace(/[^\d.,-]/g,'').replace(',', '.');
  return parseFloat(cleaned);
}
function getAmount(){
  let v = localStorage.getItem('rub'); if (!v) v = localStorage.getItem('rubAmount');
  const n = parseAmountRaw(v);
  return Number.isFinite(n) ? n : 0;
}
function formatAmountNoSymbol(n){
  return n.toLocaleString('ru-RU', { minimumFractionDigits:0, maximumFractionDigits:2 });
}
function shortName(full){
  if (!full) return '—';
  const p = full.trim().split(/\s+/);
  return p.length >= 2 ? `${p[0]} ${p[1][0].toUpperCase()}.` : p[0];
}
function copyById(id){
  const el = document.getElementById(id);
  const text = (el?.textContent || '').trim();
  if (!text) return;
  navigator.clipboard.writeText(text).then(()=>{
    const btn = document.querySelector(`.copy[data-copy-target="${id}"], .copy-inline[data-copy-target="${id}"]`);
    if (btn){ btn.style.backgroundColor = '#e5e7eb'; setTimeout(()=> btn.style.backgroundColor = '', 180); }
  });
}

/* ---------- timer (30:00) ---------- */
const PAY_WINDOW_MS = 30 * 60 * 1000; // 30 минут
const LS_TIMER_KEY = 'payment_deadline_ts';

function getDeadlineTs(){
  const fromLs = sessionStorage.getItem(LS_TIMER_KEY);
  if (fromLs) return Number(fromLs);
  const ts = Date.now() + PAY_WINDOW_MS;
  sessionStorage.setItem(LS_TIMER_KEY, String(ts));
  return ts;
}
function formatMMSS(msLeft){
  const total = Math.max(0, Math.floor(msLeft/1000));
  const m = Math.floor(total/60);
  const s = total % 60;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

/* ---------- main ---------- */
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('paymentPage')) return;

  const amount = getAmount();

  // выбрать реквизит по лимиту
  let req = REQUISITES.filter(r => amount <= r.max_amount).sort((a,b)=>a.max_amount-b.max_amount)[0];
  if (!req) req = REQUISITES[0];

  // подставить значения
  document.getElementById('number').textContent    = req.card || '—';
  document.getElementById('phone').textContent     = req.phone || '—';
  document.getElementById('recipient').textContent = shortName(req.recipient);
  document.getElementById('bank').textContent      = req.bank || '—';
  document.getElementById('amount').textContent    = formatAmountNoSymbol(amount);

  // копирование
  document.querySelector('[data-copy-target="number"]')?.addEventListener('click', () => copyById('number'));
  document.querySelector('[data-copy-target="phone"]') ?.addEventListener('click', () => copyById('phone'));

  // таймер
  const timerEl = document.getElementById('timer');
  const btn = document.getElementById('paidBtn');
  const deadline = getDeadlineTs();

  function tick(){
    const left = deadline - Date.now();
    if (left <= 0){
      timerEl.textContent = '00:00';
      btn.classList.add('disabled');
      btn.disabled = true;
      btn.textContent = 'Время вышло';
      clearInterval(intId);
      return;
    }
    timerEl.textContent = formatMMSS(left);
  }
  const intId = setInterval(tick, 500);
  tick();

  // переход
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (btn.disabled) return;
    location.assign('./success.html');
  });
});



