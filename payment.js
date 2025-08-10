// До 10 реквизитов
const requisites = [
  { bank: "ВТБ банк", number: "79517974488", recipient: "Анастасия Дмитриевна А.", max_amount: 30000 },
  { bank: "Сбер", number: "79525155329", recipient: "Всеволод Сергеевич Х.", max_amount: 80000 },
  { bank: "Альфа", number: "798362374", recipient: "Владимир Владимирович П.", max_amount: 100000 },
  { bank: "Тинькофф", number: "790987435", recipient: "Дмитрий Анатольевич М.", max_amount: 200000 },
  { bank: "ОТП-Банк", number: "798766338", recipient: "Хабиб Абдулманапович Н.", max_amount: 500000 },
  
];

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Скопировано');
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const amount = parseFloat(localStorage.getItem('rub') || '0');
  const req = requisites.find(r => amount <= r.max_amount);
  if (!req) {
    alert('Нет подходящих реквизитов под эту сумму');
    return;
  }

  document.getElementById('bank').textContent = req.bank || '—';
  document.getElementById('number').textContent = req.number;
  document.getElementById('recipient').textContent = req.recipient;
  document.getElementById('amount').textContent = amount.toLocaleString('ru-RU', { minimumFractionDigits: 2 });

  document.getElementById('paidBtn').addEventListener('click', () => {
    // здесь можно отправить данные на сервер, если нужно
    window.location.href = 'success.html';
  });
});
