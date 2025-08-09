// cash.js — выбор даты и времени для "Наличные"

// Помечаем, что пользователь пошёл по ветке "Наличные"
localStorage.setItem('flow', 'cash');

// Чистим все поля от ветки "На счёт"
localStorage.removeItem('account');
localStorage.removeItem('name');
localStorage.removeItem('comment');

// Элементы
const dateInput = document.getElementById('dateInput');
const timeSelect = document.getElementById('timeSelect');
const btnNext = document.getElementById('cashNext');

// === Минимальная дата — сегодня ===
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');

dateInput.min = `${yyyy}-${mm}-${dd}`;
dateInput.value = `${yyyy}-${mm}-${dd}`;

// === Временные слоты с 10:00 до 20:00 ===
const slots = [];
for (let h = 10; h < 20; h++) {
  const from = String(h).padStart(2, '0') + ':00';
  const to = String(h + 1).padStart(2, '0') + ':00';
  slots.push(`${from} - ${to}`);
}
timeSelect.innerHTML =
  `<option value="">Выберите время</option>` +
  slots.map(s => `<option value="${s}">${s}</option>`).join('');

// === Восстановление выбора при возврате ===
const savedTime = localStorage.getItem('time');
if (savedTime) {
  const m = savedTime.match(/^(\d{2})\.(\d{2})\.(\d{4}) (.+)$/);
  if (m) {
    const [, d, mth, y, slot] = m;
    dateInput.value = `${y}-${mth}-${d}`;
    if (slots.includes(slot)) timeSelect.value = slot;
  }
}

// === Закрытие клавиатуры при клике вне полей ===
document.addEventListener('click', (e) => {
  if (!e.target.closest('input,select,button')) document.activeElement.blur();
});

// === Переход на страницу подтверждения ===
btnNext.addEventListener('click', () => {
  const dateVal = dateInput.value;
  const timeVal = timeSelect.value;

  if (!dateVal || !timeVal) {
    alert('Пожалуйста, выберите дату и время.');
    return;
  }

  // Сохраняем метод и дату/время
  localStorage.setItem('method', 'Наличные');
  const [y, mth, d] = dateVal.split('-');
  const displayDate = `${d}.${mth}.${y}`;
  localStorage.setItem('time', `${displayDate} ${timeVal}`);

  // Переходим на confirm_cash.html с уникальным параметром
  const nocache = Date.now();
  console.log('flow =', localStorage.getItem('flow'));
  console.log('next page → confirm_cash.html');
  window.location.href = `confirm.html?nocache=${nocache}`;
});



