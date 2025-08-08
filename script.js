const input = document.getElementById('inputAmount');
const output = document.getElementById('outputAmount');
const exchangeBtn = document.getElementById('exchangeBtn');

// Курс для расчёта
const RATE_SELL = 3.95;   // RUB → CZK
const RATE_BUY  = 3.70;

// Обработка ввода
input.addEventListener('input', () => {
  input.value = input.value.replace(/\D/g, '').slice(0, 7);
  const rub = parseFloat(input.value);

  if (!isNaN(rub)) {
    const czk = rub / RATE_SELL;
    output.value = czk.toFixed(2);

    // 💾 Сохраняем данные в localStorage
    localStorage.setItem('rub', rub.toFixed(0));
    localStorage.setItem('czk', czk.toFixed(2));
    localStorage.setItem('rate', RATE_SELL);
  } else {
    output.value = '';
    localStorage.removeItem('rub');
    localStorage.removeItem('czk');
    localStorage.removeItem('rate');
  }
});

// Закрыть клавиатуру по тапу вне полей
document.addEventListener('click', (e) => {
  if (!e.target.closest('input')) document.activeElement.blur();
});

// Переход на следующую страницу
document.getElementById('exchangeBtn')?.addEventListener('click', () => {
  window.location.href = 'second.html'; // проверь имя файла
});



