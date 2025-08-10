// payment.js v4

console.log('[payment] script loaded');

const REQUISITES = [
  { bank: "Т-Банк", number: "2200 7001 1234 4321", recipient: "Наталья Ковалева", max_amount: 100000 },
  { bank: "Сбербанк", number: "+7 952 51 55 329", recipient: "Владимир П, max_amount: 50000 },
   { bank: "Альфа-Банк", number: "+7 951 797 44 88", recipient: "Дмитрий М", max_amount: 100000 },
   { bank: "ВТБ банк", number: "+7 932 551 99 88", recipient: "Всеволод Х", max_amount: 200000 },
   { bank: "Райфайзен банк", number: "2200 7001 1234 4321", recipient: "Валентина М", max_amount: 500000 },
];

function formatAmount(val){
  const n = Number(String(val).replace(',', '.'));
  if (!Number.isFinite(n)) return '— ₽';
  return n.toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + ' ₽';
}
function shortName(full){
  if (!full) return '—';
  const p = full.trim().split(/\s+/);
  return p.length >= 2 ? `${p[0]} ${p[1][0].toUpperCase()}.` : p[0];
}
function readAmountFromStorage(){
  let v = localStorage.getItem('rub');
  if (!v) v = localStorage.getItem('rubAmount'); // запасной ключ
  return v || '0';
}
function copyById(id){
  const el = document.getElementById(id);
  const text = (el?.textContent || '').trim();
  if (!text) return;
  navigator.clipboard.writeText(text).then(()=>{
    console.log('[payment] copied', id, text);
    const btn = document.querySelector(`.copy[data-copy-target="${id}"]`);
    if (btn){ btn.style.backgroundColor = '#e5e7eb'; setTimeout(()=>btn.style.backgroundColor='', 180); }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('[payment] DOM ready');

  // 1) Проверим, что JS реально подключён и элементы на месте
  const elNum = document.getElementById('cardNumber');
  const elName = document.getElementById('cardHolderShort');
  const elBank = document.getElementById('bankName');
  const elAmount = document.getElementById('payAmount');
  const btnPaid = document.getElementById('paidBtn');

  if (!elNum || !elName || !elBank || !elAmount || !btnPaid) {
    console.error('[payment] missing elements', { elNum, elName, elBank, elAmount, btnPaid });
    return;
  }

  // 2) Читаем сумму
  const raw = readAmountFromStorage();
  const amount = parseFloat(String(raw).replace(',', '.')) || 0;
  console.log('[payment] amount from LS:', raw, '=>', amount);

  // 3) Выбираем реквизиты по лимиту
  const req = REQUISITES.filter(r => amount <= r.max_amount).sort((a,b) => a.max_amount - b.max_amount)[0];
  if (!req){
    console.warn('[payment] no suitable requisites for amount', amount, 'in', REQUISITES);
    elNum.textContent = '—';
    elName.textContent = '—';
    elBank.textContent = '—';
    elAmount.textContent = formatAmount(amount);
    alert('Нет подходящих реквизитов под эту сумму');
    return;
  }

  // 4) Заполняем карточку
  elNum.textContent   = req.number;
  elName.textContent  = shortName(req.recipient);
  elBank.textContent  = req.bank || '—';
  elAmount.textContent= formatAmount(amount);

  // 5) Копирование
  document.querySelector('.copy')?.addEventListener('click', () => copyById('cardNumber'));

  // 6) Кнопка "Оплачено"
  btnPaid.addEventListener('click', (e) => {
    e.preventDefault(); e.stopPropagation();
    console.log('[payment] paid click -> success');
    // относительный путь (если страница в подпапке, адаптируй)
    location.assign('./success.html');
  });
});


