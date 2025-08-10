// До 10 реквизитов: подбираем первый с max_amount >= сумма
const REQUISITES = [
  { bank: "Т-Банк", number: "2200 7001 1234 4321", recipient: "Наталья Ковалева", max_amount: 100000 },
  // { bank: "Сбер", number: "5469 12** **** 1234", recipient: "Пётр Иванов", max_amount: 200000 },
  // ... до 10
];

function formatAmount(val){
  const n = Number(String(val).replace(',', '.'));
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + ' ₽';
}

function shortName(full){
  // "Иван Миронов" -> "Иван М."; "Наталья Ковалева Петровна" -> "Наталья К."
  if (!full) return '—';
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const last = parts[1] || '';
  return `${parts[0]} ${last.charAt(0).toUpperCase()}.`;
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

document.addEventListener('DOMContentLoaded', () => {
  const rubRaw = localStorage.getItem('rub') || '0';
  const amount = parseFloat(String(rubRaw).replace(',', '.')) || 0;

  // выбрать подходящий реквизит
  const req = REQUISITES
    .filter(r => amount <= r.max_amount)
    .sort((a,b) => a.max_amount - b.max_amount)[0];

  if (!req){
    alert('Нет подходящих реквизитов под эту сумму');
    return;
  }

  // заполнить карточку
  document.getElementById('number').textContent = req.number;
  document.getElementById('shortName').textContent = shortName(req.recipient);
  document.getElementById('bank').textContent = req.bank || '—';
  document.getElementById('amount').textContent = formatAmount(amount);

  // копирование номера
  document.querySelector('.copy')?.addEventListener('click', () => copyById('number'));

  // кнопка "Оплачено"
  document.getElementById('paidBtn').addEventListener('click', () => {
    window.location.href = 'success.html';
  });
});

