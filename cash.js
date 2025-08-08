// Заполняем дату: минимум — сегодня
const dateInput = document.getElementById('dateInput');
const timeSelect = document.getElementById('timeSelect');
const btnNext = document.getElementById('cashNext');

// min для даты — сегодня
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');
dateInput.min = `${yyyy}-${mm}-${dd}`;
dateInput.value = `${yyyy}-${mm}-${dd}`;

// Слоты 10:00–20:00
const slots = [];
for (let h = 10; h < 20; h++) {
  slots.push(`${String(h).padStart(2,'0')}:00 - ${String(h+1).padStart(2,'0')}:00`);
}
timeSelect.innerHTML =
  `<option value="">Выберите время</option>` +
  slots.map(s => `<option value="${s}">${s}</option>`).join('');

// Вернём выбранные ранее значения, если есть
const savedTime = localStorage.getItem('time');
if (savedTime) {
  const m = savedTime.match(/^(\d{2})\.(\d{2})\.(\d{4}) (.+)$/);
  if (m) {
    const [, d, mth, y, slot] = m;
    dateInput.value = `${y}-${mth}-${d}`;
    if (slots.includes(slot)) timeSelect.value = slot;
  }
}

// Скрыть клавиатуру по тапу вне полей
document.addEventListener('click', (e) => {
  if (!e.target.closest('input,select,button')) document.activeElement.blur();
});

// Сохранение и переход
btnNext.addEventListener('click', () => {
  const dateVal = dateInput.value;
  const timeVal = timeSelect.value;

  if (!dateVal || !timeVal) {
    alert('Пожалуйста, выберите дату и время.');
    return;
  }

  // сохраняем способ и "Дата и время"
  localStorage.setItem('method', 'Наличные');
  localStorage.removeItem('account'); // чтобы не мешался счёт из другой ветки

  const [y, mth, d] = dateVal.split('-');
  const displayDate = `${d}.${mth}.${y}`;
  localStorage.setItem('time', `${displayDate} ${timeVal}`);

  // Анти-кэш метка и переход
  const v = Date.now();
  console.log('GO → confirm_cash.html');
  window.location.href = `confirm_cash.html?v=${v}`;
});

