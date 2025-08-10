console.log('[payment] v7 loaded');

// До 10 реквизитов: добавили phone и card
const REQUISITES = [
  {
    bank: "Сбербанк",
    card: "2200 7001 1234 4321",
    phone: "+7 952 51 55 329",
    recipient: "Владимир Путин",
    max_amount: 100000
  },
  {
    bank: "Т-Банк",
    card: "5536 9100 1122 3344",
    phone: "+7 951 797 44 88",
    recipient: "Наталья Ковалева",
    max_amount: 200000
  },
  {
    bank: "ВТБ банк",
    card: "4276 3200 5566 7788",
    phone: "+7 932 551 99 88",
    recipient: "Всеволод Рублев",
    max_amount: 300000
  },
  {
    bank: "Райфайзен банк",
    card: "2200 7001 9876 5432",
    phone: "+7 900 000 00 00",
    recipient: "Валентина Матвиенко",
    max_amount: 500000
  },
  // ...добавляй до 10
];

// --- utils ---
function parseAmountRaw(v) {
  if (v == null) return NaN;
  const cleaned = String(v)
    .replace(/\u202F|\u00A0|\s/g, '')
    .replace(/[^\d.,-]/g, '')
    .replace(',', '.');
  return parseFloat(cleaned);
}
function getAmount() {
  let v = localStorage.getItem('rub');
  if (!v) v = localStorage.getItem('rubAmount');
  const n = parseAmountRaw(v);
  return Number.isFinite(n) ? n : 0;
}
function formatAmountNoSymbol(n) {
  return n.toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}
function shortName(full) {
  if (!full) return '—';
  const p = full.trim().split(/\s+/);
  return p.length >= 2 ? `${p[0]} ${p[1][0].toUpperCase()}.` : p[0];
}
function copyById(id) {
  const el = document.getElementById(id);
  const text = (el?.textContent || '').trim();
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector(`.copy[data-copy-target="${id}"], .copy-inline[data-copy-target="${id}"]`);
    if (btn) { btn.style.backgroundColor = '#e5e7eb'; setTimeout(() => btn.style.backgroundColor = '', 180); }
  });
}

// --- main ---
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('paymentPage')) return;

  const amount = getAmount();

  // выбираем минимальный max_amount, который >= сумма
  let req = REQUISITES
    .filter(r => amount <= r.max_amount)
    .sort((a, b) => a.max_amount - b.max_amount)[0];
  if (!req) req = REQUISITES[0]; // на всякий случай

  // Подставляем данные (IDs — те же, что уже работают)
  document.getElementById('number').textContent    = req.card || '—';
  document.getElementById('phone').textContent     = req.phone || '—';
  document.getElementById('recipient').textContent = shortName(req.recipient);
  document.getElementById('bank').textContent      = req.bank || '—';
  document.getElementById('amount').textContent    = formatAmountNoSymbol(amount);

  // Копирование
  document.querySelector('[data-copy-target="number"]')
    ?.addEventListener('click', () => copyById('number'));
  document.querySelector('[data-copy-target="phone"]')
    ?.addEventListener('click', () => copyById('phone'));

  // Переход
  document.getElementById('paidBtn').addEventListener('click', (e) => {
    e.preventDefault();
    location.assign('./success.html');
  });
});


