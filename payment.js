console.log('[payment] v6 loaded');

// Реквизиты: ПОЧИНИЛ кавычку и оставил до 10 штук как пример
const REQUISITES = [
  { bank: "Т-Банк",        number: "2200 7001 1234 4321", recipient: "Наталья Ковалева",   max_amount: 100000 },
  { bank: "Сбербанк",      number: "+7 952 51 55 329",    recipient: "Владимир Путин",     max_amount: 50000  },
  { bank: "Альфа-Банк",    number: "+7 951 797 44 88",    recipient: "Дмитрий Медведев",   max_amount: 100000 },
  { bank: "ВТБ банк",      number: "+7 932 551 99 88",    recipient: "Всеволод Рублев",    max_amount: 200000 },
  { bank: "Райфайзен банк",number: "2200 7001 1234 4321", recipient: "Валентина Матвиенко",max_amount: 500000 }
];

// --- utils ---
function parseAmountRaw(v) {
  if (v == null) return NaN;
  const cleaned = String(v)
    .replace(/\u202F|\u00A0|\s/g, '')   // любые пробелы (в т.ч. неразрывные)
    .replace(/[^\d.,-]/g, '')           // убираем всё, кроме цифр/.,,
    .replace(',', '.');                 // запятая -> точка
  return parseFloat(cleaned);
}
function getAmount() {
  let v = localStorage.getItem('rub');
  if (!v) v = localStorage.getItem('rubAmount');
  const n = parseAmountRaw(v);
  console.log('[payment] raw amount from LS:', v, '->', n);
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
    const btn = document.querySelector(`.copy[data-copy-target="${id}"]`);
    if (btn) { btn.style.backgroundColor = '#e5e7eb'; setTimeout(() => btn.style.backgroundColor = '', 180); }
  });
}

// --- main ---
document.addEventListener('DOMContentLoaded', () => {
  console.log('[payment] DOM ready');

  // ИСПОЛЬЗУЕМ ТЕ ЖЕ id, ЧТО В ТВОЁМ payment.html
  const elNum    = document.getElementById('number');
  const elName   = document.getElementById('recipient');
  const elBank   = document.getElementById('bank');
  const elAmount = document.getElementById('amount');
  const btnPaid  = document.getElementById('paidBtn');

  if (!elNum || !elName || !elBank || !elAmount || !btnPaid) {
    console.error('[payment] missing elements', { elNum, elName, elBank, elAmount, btnPaid });
    return;
  }

  const amount = getAmount();

  // Подбираем минимальный max_amount, который >= суммы; если не нашли, берём первый
  let req = REQUISITES.filter(r => amount <= r.max_amount).sort((a, b) => a.max_amount - b.max_amount)[0];
  if (!req) req = REQUISITES[0];

  // Подставляем
  elNum.textContent    = req.number || '—';
  elName.textContent   = shortName(req.recipient);
  elBank.textContent   = req.bank || '—';
  elAmount.textContent = formatAmountNoSymbol(amount); // символ ₽ добавляет CSS ::after

  // Копирование номера
  document.querySelector('.copy')?.addEventListener('click', () => copyById('number'));

  // Переход
  btnPaid.addEventListener('click', (e) => {
    e.preventDefault(); e.stopPropagation();
    location.assign('./success.html');
  });
});

