const input = document.getElementById('inputAmount');
const output = document.getElementById('outputAmount');
const exchangeBtn = document.getElementById('exchangeBtn');

// КУРСЫ
const RATE_SELL_NORMAL = 3.95;     // < 20 000 CZK
const RATE_SELL_DISCOUNT = 3.9;    // ≥ 20 000 CZK

function formatNumber(n) {
  return Number(n).toLocaleString('ru-RU'); // например: 25 000
}

// Обратная функция — убираем пробелы и превращаем в число
function parseNumber(str) {
  return parseFloat(str.replace(/\s/g, ''));
}

input.addEventListener('input', () => {
  // Удаляем нецифры и пробелы
  let raw = input.value.replace(/\D/g, '').slice(0, 7);

  if (raw === '') {
    output.value = '';
    localStorage.removeItem('rub');
    localStorage.removeItem('czk');
    localStorage.removeItem('rate');
    return;
  }

  const rub = parseFloat(raw);
  let rateToUse = RATE_SELL_NORMAL;
  const czk_temp = rub / RATE_SELL_NORMAL;

  if (czk_temp >= 20000) {
    rateToUse = RATE_SELL_DISCOUNT;
  }

  const czk = Math.floor(rub / rateToUse); // округляем вниз до целого
  input.value = formatNumber(rub);         // ← форматируем input обратно с пробелами
  output.value = formatNumber(czk);        // ← форматированный CZK (целое число)

  // Сохраняем как числа без пробелов
  localStorage.setItem('rub', rub);
  localStorage.setItem('czk', czk);
  localStorage.setItem('rate', rateToUse);
});

// Закрытие клавиатуры по тапу вне инпутов
document.addEventListener('click', (e) => {
  if (!e.target.closest('input')) {
    document.activeElement.blur();
  }
});

// Переход на следующую страницу
exchangeBtn?.addEventListener('click', () => {
  window.location.href = 'second.html';
});





