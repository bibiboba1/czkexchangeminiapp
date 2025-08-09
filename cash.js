// cash.js — выбор даты и времени для "Наличные"

// Помечаем, что пользователь пошёл по ветке "Наличные"
localStorage.setItem('flow', 'cash');

// Чистим поля от ветки "На счёт"
// Если хочешь показывать имя/комментарий на confirm — НЕ удаляй их
localStorage.removeItem('account');
// localStorage.removeItem('name');
// localStorage.removeItem('comment');

// Элементы
const dateInput  = document.getElementById('dateInput');
const timeSelect = document.getElementById('timeSelect');
const btnNext    = document.getElementById('cashNext');

if (!dateInput || !timeSelect || !btnNext) {
  console.warn('[cash] missing required elements');
}

// === Минимальная дата — сегодня ===
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');

if (dateInput) {
  dateInput.min = `${yyyy}-${mm}-${dd}`;
  dateInput.value = `${yyyy}-${mm}-${dd}`;
}

// === Временные слоты с 10:00 до 20:00 (часы) ===
const slots = [];
for (let h = 10; h < 20; h++) {
  const from = String(h).padStart(2, '0') + ':00';
  const to   = String(h + 1).padStart(2, '0') + ':00';
  slots.push(`${from} - ${to}`);
}
if (timeSelect) {
  timeSelect.innerHTML =
    `<option value="">Выберите время</option>` +
    slots.map(s => `<option value="${s}">${s}</option>`).join('');
}

// === Восстановление выбора при возврате ===
const savedTime = localStorage.getItem('time');
if (savedTime && dateInput && timeSelect) {
  const m = savedTime.match(/^(\d{2})\.(\d{2})\.(\d{4}) (.+)$/);
  if (m) {
    const [, d2, mth2, y2, slot] = m;
    dateInput.value = `${y2}-${mth2}-${d2}`;
    if (slots.includes(slot)) timeSelect.value = slot;
  }
}

// === Закрытие клавиатуры при клике вне полей ===
document.addEventListener('click', (e) => {
  if (!e.target.closest('input,select,button')) document.activeElement?.blur?.();
});

// === Переход на страницу подтверждения ===
btnNext?.addEventListener('click', () => {
  const dateVal = dateInput?.value || '';
  const timeVal = timeSelect?.value || '';

  if (!dateVal || !timeVal) {
    alert('Пожалуйста, выберите дату и время.');
    return;
  }

  // Сохраняем метод и дату/время
  localStorage.setItem('method', 'Наличные');
  const [y, mth, d] = dateVal.split('-');
  const displayDate = `${d}.${mth}.${y}`; // ДД.ММ.ГГГГ
  localStorage.setItem('time', `${displayDate} ${timeVal}`);

  // На всякий случай фиксируем ветку прямо перед переходом
  localStorage.setItem('flow', 'cash');

  // Переходим на единую страницу подтверждения
  const nocache = Date.now();
  console.log('[cash] next → confirm.html', {
    flow: localStorage.getItem('flow'),
    time: localStorage.getItem('time')
  });
  window.location.href = `last.html?nocache=${nocache}`;
});




