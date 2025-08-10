// До 10 реквизитов: подбираем первый с max_amount >= сумма
const REQUISITES = [
  { bank: "Т-Банк", number: "2200 7001 1234 4321", recipient: "Наталья Ковалева", max_amount: 100000 },
  { bank: "Сбербанк", number: "+7 952 51 55 329", recipient: "Владимир П, max_amount: 50000 },
   { bank: "Альфа-Банк", number: "+7 951 797 44 88", recipient: "Дмитрий М", max_amount: 100000 },
   { bank: "ВТБ банк", number: "+7 932 551 99 88", recipient: "Всеволод Х", max_amount: 200000 },
   { bank: "Райфайзен банк", number: "2200 7001 1234 4321", recipient: "Валентина М", max_amount: 500000 },
];

// --- helpers ---
function formatAmount(val){
  const n = Number(String(val).replace(',', '.'));
  if (!Number.isFinite(n)) return '— ₽';
  return n.toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + ' ₽';
}
function shortName(full){
  if (!full) return '—';
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[1]?.[0]?.toUpperCase() || ''}.`;
}
function copyById(id){
  const el = document.getElementById(id);
  const text = (el?.textContent || '').trim();
  if (!text) return;
  navigator.clipboard.writeText(text).then(()=>{
    const btn = document.querySelector(`.copy[data-copy-target="${id}"]`);
    if (btn){
      const old = btn.style.backgroundColor;
      btn.style.backgroundColor = '#e5e7eb';
      setTimeout(()=> btn.style.backgroundColor = old, 180);
    }
  });
}
function readAmountFromStorage(){
  // читаем и rub, и rubAmount (на всякий)
  let v = localStorage.getItem('rub');
  if (v === null || v === '') v = localStorage.getItem('rubAmount');
  return v ?? '0';
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('[payment] init');

  const raw = readAmountFromStorage();
  const amount = parseFloat(String(raw).replace(',', '.')) || 0;
  console.log('[payment] amount from LS:', raw, '=>', amount);

  // выбрать подходящий реквизит
  const req = REQUISITES
    .filter(r => amount <= r.max_amount)
    .sort((a,b) => a.max_amount - b.max_amount)[0];

  if (!req){
    console.warn('[payment] no suitable requisites for amount', amount);
    alert('Нет подходящих реквизитов под эту сумму');
    return;
  }

  // заполнить карточку
  document.getElementById('cardNumber').textContent   = req.number;
  document.getElementById('cardHolderShort').textContent = shortName(req.recipient);
  document.getElementById('bankName').textContent     = req.bank || '—';
  document.getElementById('payAmount').textContent    = formatAmount(amount);

  // копирование номера
  document.querySelector('.copy')?.addEventListener('click', () => copyById('cardNumber'));

  // кнопка "Оплачено"
  document.getElementById('paidBtn').addEventListener('click', () => {
    window.location.href = 'success.html';
  });
});


