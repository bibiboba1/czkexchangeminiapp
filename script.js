const input = document.getElementById('inputAmount');
const output = document.getElementById('outputAmount');
const exchangeBtn = document.getElementById('exchangeBtn');

// КУРСЫ
function getRate(rub) {
  const czk = rub / 3.95;
  return czk >= 20000 ? 3.9 : 3.95;
}

// Формат числа: "20 000"
function formatNumber(n) {
  return Math.round(n).toLocaleString('ru-RU');
}

// Обработка ввода
input.addEventListener('input', () => {
  input.value = input.value.replace(/\D/g, '').slice(0, 7);

  const rub = parseFloat(input.value);
  if (!isNaN(rub)) {
    const rate = getRate(rub);
    const czk = rub / rate;

    localStorage.setItem('rub', Math.round(rub));
    localStorage.setItem('czk', Math.round(czk));
    localStorage.setItem('rate', rate);

    output.value = formatNumber(czk); // показываем CZK без копеек и с пробелами
  } else {
    output.value = '';
    localStorage.removeItem('rub');
    localStorage.removeItem('czk');
    localStorage.removeItem('rate');
  }
});

// Убираем клавиатуру при клике вне input
document.addEventListener('click', (e) => {
  if (!e.target.closest('input')) {
    document.activeElement.blur();
  }
});

// Переход на следующую страницу
exchangeBtn?.addEventListener('click', () => {
  window.location.href = 'second.html';
});




  







