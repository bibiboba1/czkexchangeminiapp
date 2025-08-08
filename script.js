const input = document.getElementById('inputAmount');
const output = document.getElementById('outputAmount');
const exchangeBtn = document.getElementById('exchangeBtn');

// Курс для расчёта (пример)
const RATE_SELL = 3.95;   // «продажа» CZK за RUB (сколько RUB за 1 CZK)
const RATE_BUY  = 3.70;   // «покупка» CZK за RUB

// При вводе считаем по продаже (как на скрине — ввёл RUB, получил CZK)
input.addEventListener('input', () => {
  // Удаляем все нецифры и ограничиваем до 7 символов
  input.value = input.value.replace(/\D/g, '').slice(0, 7);

  const rub = parseFloat(input.value);
  if (!isNaN(rub)) {
    const czk = rub / RATE_SELL;
    output.value = czk.toFixed(2);
  } else {
    output.value = '';
  }
});


// Закрыть клавиатуру по тапу вне полей
document.addEventListener('click', (e) => {
  if (!e.target.closest('input')) document.activeElement.blur();
});

// Переход на следующую страницу
document.getElementById('exchangeBtn')?.addEventListener('click', () => {
  window.location.href = 'next_page.html';
});

