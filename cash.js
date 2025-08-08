// cash.js
localStorage.setItem('flow', 'cash');
localStorage.removeItem('account');
localStorage.removeItem('name');
// если хочешь ещё жёстче:
// localStorage.removeItem('comment');


// Элементы
const dateInput = document.getElementById('dateInput');
const timeSelect = document.getElementById('timeSelect');
const btnNext = document.getElementById('cashNext');

// === Дата: минимум — сегодня, по умолчанию — сегодня ===
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');

dateInput.min = `${yyyy}-${mm}-${dd}`;
dateInput.value = `${yyyy}-${mm}-${dd}`;

// === Временные слоты 10:00–20:00 ===
const slots = [];
for (let h = 10; h < 20; h++) {
  const from = String(h).padStart(2, '0') + ':00';
  const to = String(h + 1).padStart(2, '0') + ':00';
  slots.push(`${from} - ${to}`);
}
timeSelect.innerHTML =
  `<option value="">Выберите время</option>` +
  slots.map(s => `<option value="${s}">${s}</option>`).join('');

// === Восстанавливаем выбор, если пользователь возвращался назад ===
const savedTime = localStorage.getItem('time'); // формат "ДД.ММ.ГГГГ HH:MM - HH:MM"
if (savedTime) {
  const m = savedTime.match(/^(\d{2})\.(\d{2})\.(\d{4}) (.+)$/);
  if (m) {
    const [, d, mth, y, slot] = m;
    dateInput.value = `${y}-${mth}-${d}`;
    if (slots.includes(slot)) timeSelect.value = slot;
  }
}

// === Скрыть клавиатуру по тапу вне полей (на мобилках) ===
document.addEventListener('click', (e) => {
  if (!e.target.closest('input,select,button')) document.activeElement.blur();
});

// === Переход на подтверждение ===
btnNext.addEventListener('click', () => {
  const dateVal = dateInput.value; // YYYY-MM-DD
  const timeVal = timeSelect.value; // "HH:MM - HH:MM"

  if (!dateVal || !timeVal) {
    alert('Пожалуйста, выберите дату и время.');
    return;
  }

  // Сохраняем способ и «Дата и время»
  localStorage.setItem('method', 'Наличные');
  localStorage.removeItem('account'); // чтобы не мешались данные ветки "На счёт"

  // Преобразуем дату к "ДД.ММ.ГГГГ"
  const [y, mth, d] = dateVal.split('-');
  const displayDate = `${d}.${mth}.${y}`;
  localStorage.setItem('time', `${displayDate} ${timeVal}`);

  // Переход на страницу подтверждения для наличных + анти-кэш
  const v = Date.now();
  console.log('GO → confirm_cash.html');
  window.location.href = `confirm_cash.html?v=${v}`;
});


