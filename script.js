const inputAmount = document.getElementById('inputAmount');
const outputAmount = document.getElementById('outputAmount');
const exchangeBtn = document.getElementById('exchangeBtn');

// Примерная логика расчета (курс может быть динамическим)
const getRate = (rubAmount) => {
    const rate = 3.84; // фиксированный пример
    return rubAmount / rate;
};

inputAmount.addEventListener('input', () => {
    const rub = parseFloat(inputAmount.value);
    if (!isNaN(rub)) {
        const czk = getRate(rub);
        outputAmount.value = czk.toFixed(2);
    } else {
        outputAmount.value = '';
    }
});

// Кнопка "Поменять" — переход на следующую страницу
exchangeBtn.addEventListener('click', () => {
    // Например, можно использовать window.location.href
    window.location.href = "next_page.html"; // или любой путь к следующей странице
});
