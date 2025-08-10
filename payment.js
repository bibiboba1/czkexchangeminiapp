// payment.js v4

console.log('[payment] script loaded');

const REQUISITES = [
  { bank: "Т-Банк", number: "2200 7001 1234 4321", recipient: "Наталья Ковалева", max_amount: 100000 },
  { bank: "Сбербанк", number: "+7 952 51 55 329", recipient: "Владимир Путин, max_amount: 50000 },
   { bank: "Альфа-Банк", number: "+7 951 797 44 88", recipient: "Дмитрий Медведев", max_amount: 100000 },
   { bank: "ВТБ банк", number: "+7 932 551 99 88", recipient: "Всеволод Рублев", max_amount: 200000 },
   { bank: "Райфайзен банк", number: "2200 7001 1234 4321", recipient: "Валентина Матвиенко", max_amount: 500000 }
];
// Читаем сумму
function getAmount(){
  let v = localStorage.getItem('rub');
  if(!v) v = localStorage.getItem('rubAmount');
  return parseFloat(v) || 0;
}

// Формат суммы
function formatAmount(v){
  return v.toLocaleString('ru-RU') + ' ₽';
}

// Сокращённое имя
function shortName(full){
  const parts = full.split(' ');
  if(parts.length < 2) return full;
  return parts[0] + ' ' + parts[1][0] + '.';
}

// Копирование
function copyText(id){
  const el = document.getElementById(id);
  if(!el) return;
  navigator.clipboard.writeText(el.textContent.trim());
}

document.addEventListener('DOMContentLoaded', () => {
  const amount = getAmount();

  // Выбираем подходящий счёт
  const req = REQUISITES.find(r => amount <= r.max_amount);
  if(!req){
    alert('Нет подходящего счёта для этой суммы');
    return;
  }

  // Заполняем
  document.getElementById('cardNumber').textContent = req.number;
  document.getElementById('cardHolderShort').textContent = shortName(req.recipient);
  document.getElementById('bankName').textContent = req.bank;
  document.getElementById('payAmount').textContent = formatAmount(amount);

  // Копирование
  document.querySelector('.copy').addEventListener('click', () => copyText('cardNumber'));

  // Оплачено
  document.getElementById('paidBtn').addEventListener('click', () => {
    window.location.href = 'success.html';
  });
});
