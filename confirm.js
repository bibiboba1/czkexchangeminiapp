// confirm.js — страница подтверждения для ветки "На счёт"

// Если пользователь выбрал "Наличные", перебросим на правильную страницу
if (localStorage.getItem('flow') === 'cash') {
  location.replace('confirm_cash.html');
}

function formatNumber(n) {
  return Number(n).toLocaleString('ru-RU');
}

// помощник: безопасно записывает текст, если элемент существует
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

document.addEventListener('DOMContentLoaded', () => {
  // Если это вообще не страница подтверждения — выходим
  if (!document.getElementById('confirmPage')) return;

  // Читаем данные
  const rub     = localStorage.getItem('rub') || 0;
  const czk     = localStorage.getItem('czk') || 0;
  const rate    = localStorage.getItem('rate') || '';
  const method  = localStorage.getItem('method') || 'На счёт';
  const account = localStorage.getItem('account') || '';
  const name    = localStorage.getItem('name') || '';
  const comment = localStorage.getItem('comment') || '';
  const time    = localStorage.getItem('time') || '';

  // Подставляем только в те элементы, которые есть на странице
  setText('rubAmount', formatNumber(rub));
  setText('czkAmount', formatNumber(czk));
  setText('rate', rate);
  setText('method', method);
  setText('acc', account);
  setText('username', name);
  setText('commentText', comment);
  setText('time', time);

  // Кнопка отправки (если есть)
  const btn = document.querySelector('.btn-yellow');
  btn?.addEventListener('click', async () => {
    // …тут ваш текущий код отправки /api/send (оставляйте как есть)
  });
});

