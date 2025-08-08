const input = document.getElementById('inputAmount');
const output = document.getElementById('outputAmount');
const exchangeBtn = document.getElementById('exchangeBtn');

// Пример фиксированного курса
const rate = 3.84;

input.addEventListener('input', () => {
    const rub = parseFloat(input.value);
    if (!isNaN(rub)) {
        const czk = rub / rate;
        output.value = czk.toFixed(2);
    } else {
        output.value = '';
    }
});

exchangeBtn.addEventListener('click', () => {
    window.location.href = 'next_page.html'; // или другая логика
});

// Закрытие клавиатуры по клику вне инпутов
document.addEventListener('click', (e) => {
    if (!e.target.closest('input')) {
        document.activeElement.blur();
    }
});
