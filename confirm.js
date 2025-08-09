// confirm.js — единая страница подтверждения для веток "На счёт" и "Наличные"

// Форматирование числа (например: 20 000)
function formatNumber(n) {
  const num = Number(n);
  return Number.isFinite(num) ? num.toLocaleString('ru-RU') : '0';
}

// Безопасная установка текста
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? '';
}

document.addEventListener('DOMContentLoaded', () => {
  // Выполняемся только на confirm.html (добавь в разметку контейнер с таким id)
  if (!document.getElementById('confirmPage')) return;

  // Что выбрал пользователь: 'account' | 'cash'
  const flow    = localStorage.getItem('flow') || 'account';

  // Общие данные
  const rub     = localStorage.getItem('rub') || 0;
  const czk     = localStorage.getItem('czk') || 0;
  const rate    = localStorage.getItem('rate') || '';

  // Данные ветки "На счёт"
  const account = localStorage.getItem('account') || '';
  const name    = localStorage.getItem('name') || '';
  const comment = localStorage.getItem('comment') || '';

  // Время/метод, которые могли быть выставлены ранее
  const storedMethod = localStorage.getItem('method');
  const storedTime   = localStorage.getItem('time');

  // Расчёт выводимых полей в зависимости от ветки
  let methodOut, timeOut, accOut;

  if (flow === 'cash') {
    // Ветка "Наличные"
    methodOut = 'Наличные';                  // фиксированно показываем "Наличные"
    accOut    = '-';                         // счёта нет
    timeOut   = storedTime || '—';           // дата и время с Cash-экрана
  } else {
    // Ветка "На счёт"
    methodOut = storedMethod || 'На счёт';
    accOut    = account;
    timeOut   = storedTime || 'до 1 часа';   // как было раньше
  }

  // Подстановка значений на страницу
  setText('rubAmount', formatNumber(rub));
  setText('czkAmount', formatNumber(czk));
  setText('rate',      rate);
  setText('method',    methodOut);
  setText('acc',       accOut);     // "Ваш номер счёта"
  setText('username',  name);
  setText('commentText', comment);
  setText('time',      timeOut);    // "Ожидаемое время"

  // Кнопка отправки (оставь свою реализацию, если была)
  const btn = document.querySelector('.btn-yellow');
  btn?.addEventListener('click', async () => {
    // …тут ваш текущий код отправки /api/send…
  });
});

