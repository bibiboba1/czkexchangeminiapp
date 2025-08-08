const input = document.getElementById('inputAmount');
const output = document.getElementById('outputAmount');
const exchangeBtn = document.getElementById('exchangeBtn');

// КУРСЫ
const RATE_SELL_NORMAL = 3.95;    // < 20 000 CZK
const RATE_SELL_DISCOUNT = 3.9;   // >= 20 000 CZK

// Выбор курса в зависимости от суммы
function getRate(rub) {
  const czk = rub / RATE_SELL_NORMAL;
  return czk >= 20000 ? RATE_SELL_DISCOUNT : RATE_SELL_NORMAL;
}

// Формат чисел: 20000 → 20 000
function formatNumber(n) {
  return Number(n).toLocaleString('ru-RU');
}

// При вводе:
input.addEventListener('input', () => {
  input.value = input.value.replace(/\D/g, '').slice(0, 7);
  const rub = parseFloat(input.value);

  if (!isNaN(rub)) {
    const rate = getRate(rub);
    const czk = rub / rate;

    // Сохраняем в localStorage (без копеек)
    localStorage.setItem('rub', Math.round(rub));
    localStorage.setItem('czk', Math.round(czk));
    localStorage.setItem('rate', rate);

    // Отображаем красиво
    output.value = formatNumber(czk);
  } else {
    output.value = '';
    localStorage.removeItem('rub');
    localStorage.removeItem('czk');
    localStorage.removeItem('rate');
  }
});

// Закрыть клавиатуру по нажатию вне поля
document.addEventListener('click', (e) => {
  if (!e.target.closest('input')) {
    document.activeElement.blur();
  }
});

// Переход на следующую страницу
exchangeBtn?.addEventListener('click', () => {
  window.location.href = 'second.html';
});





