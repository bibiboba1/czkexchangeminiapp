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
dateInput.value = `${yyyy}-${mm}-${dd}`; // по умолчанию — сегодня

// Заполняем временные слоты с 10:00 до 20:00
const slots = [];
for (let h = 10; h < 20; h++) {
  slots.push(`${String(h).padStart(2,'0')}:00 - ${String(h+1).padStart(2,'0')}:00`);
}
timeSelect.innerHTML = `<option value="">Выберите время</option>` +
  slots.map(s => `<option value="${s}">${s}</option>`).join('');

// Скрытие клавиатуры по тапу вне полей (для input[type=date] не критично, но на будущее)
document.addEventListener('click', (e) => {
  if (!e.target.closest('input,select,button')) document.activeElement.blur();
});

// Сохранение и переход дальше
btnNext.addEventListener('click', () => {
  const dateVal = dateInput.value;
  const timeVal = timeSelect.value;

  if (!dateVal || !timeVal) {
    alert('Пожалуйста, выберите дату и время.');
    return;
  }

  // сохраняем выбранный способ и время
  localStorage.setItem('method', 'Наличные');
  // Красивый вид даты для подтверждения (ДД.ММ.ГГГГ)
  const [y,m,d] = dateVal.split('-');
  const displayDate = `${d}.${m}.${y}`;
  localStorage.setItem('time', `${displayDate} ${timeVal}`);

  // Следующая страница (подтвеждение)
console.log('GO → confirm_cash.html');   // лог для проверки

  window.location.href = 'confirm_cash.html';
});
