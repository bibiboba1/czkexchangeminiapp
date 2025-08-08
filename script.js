const input = document.getElementById('inputAmount');
const output = document.getElementById('outputAmount');
const exchangeBtn = document.getElementById('exchangeBtn');

// КУРСЫ
const RATE_SELL_NORMAL = 3.95;
const RATE_SELL_DISCOUNT = 3.9;

// Форматируем число с пробелами
function formatNumber(n) {
  return Number(n).toLocaleString('ru-RU');
}

// Слушаем ввод
input.addEventListener('input', () => {
  // Очищаем всё кроме цифр
  let raw = input.value.replace(/\D/g, '');

  // Ограничиваем длину
  if (raw.length > 7) raw = raw.slice(0, 7);

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

  if (czk_temp >= 20000) rateToUse = RATE_SELL_DISCOUNT;

  const czk = Math.floor(rub / rateToUse);

  // Сохраняем
  l







