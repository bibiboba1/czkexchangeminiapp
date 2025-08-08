const input = document.getElementById('inputAmount');
const output = document.getElementById('outputAmount');
const exchangeBtn = document.getElementById('exchangeBtn');

// КУРСЫ
const RATE_SELL_NORMAL = 3.95; // < 20 000 CZK
const RATE_SELL_DISCOUNT = 3.9; // >= 20 000 CZK

input.addEventListener('input', () => {
  input.value = input.value.replace(/\D/g, '').slice(0, 7);
  const rub = parseFloat(input.value);

  if (!isNaN(rub)) {
    // Пробный пересчёт, чтобы понять, какой курс использовать
    let czk_temp = rub / RATE_SELL_NORMAL;
    let rateToUse = RATE_SELL_NORMAL;

    if (czk_temp >= 20000) {
      rateToUse = RATE_SELL_DISCOUNT;
    }

    const czk = rub / rateToUse;
    output.value = czk.toFixed(2);

    // Сохраняем в localStorage
    localStorage.setItem('rub', rub.toFixed(0));
    localStorage.setItem('czk', czk.toFixed(2));
    localStorage.setItem('rate', rateToUse);
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
  window.location.href = 'second.html';
});




