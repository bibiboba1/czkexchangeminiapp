input.addEventListener('input', () => {
  input.value = input.value.replace(/\D/g, '').slice(0, 7);

  const rub = parseFloat(input.value);
  if (!isNaN(rub)) {
    const czk = rub / getRate(rub);

    // Сохраняем как числа
    localStorage.setItem('rub', Math.round(rub));
    localStorage.setItem('czk', Math.round(czk));
    localStorage.setItem('rate', getRate(rub));

    // Отображаем красиво
    output.value = formatNumber(czk);
  } else {
    output.value = '';
    localStorage.removeItem('rub');
    localStorage.removeItem('czk');
    localStorage.removeItem('rate');
  }
});

// Определение курса в зависимости от суммы
function getRate(rub) {
  const czk = rub / 3.95;
  return czk >= 20000 ? 3.9 : 3.95;
}

// Формат числа: "20 000"
function formatNumber(n) {
  return Math.round(n).toLocaleString('ru-RU');
}



  







