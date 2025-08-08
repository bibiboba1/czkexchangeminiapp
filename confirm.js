// Форматирование чисел с пробелами (например: 20 000)
function formatNumber(n) {
  return Number(n).toLocaleString('ru-RU');
}

document.addEventListener('DOMContentLoaded', () => {
  // Подставляем значения в элементы, форматируем числа
  document.getElementById('rubAmount').textContent = formatNumber(localStorage.getItem('rub') || 0);
  document.getElementById('czkAmount').textContent = formatNumber(localStorage.getItem('czk') || 0);
  document.getElementById('rate').textContent = localStorage.getItem('rate') || '';
  document.getElementById('method').textContent = localStorage.getItem('method') || '';
  document.getElementById('acc').textContent = localStorage.getItem('account') || '';
  document.getElementById('username').textContent = localStorage.getItem('name') || '';
  document.getElementById('commentText').textContent = localStorage.getItem('comment') || '';
  document.getElementById('time').textContent = localStorage.getItem('time') || '';

  // Обработка нажатия на кнопку "Создать заявку"
  document.querySelector('.btn-yellow')?.addEventListener('click', () => {
    const data = {
      rub: localStorage.getItem('rub'),
      czk: localStorage.getItem('czk'),
      rate: localStorage.getItem('rate'),
      method: localStorage.getItem('method'),
      account: localStorage.getItem('account'),
      name: localStorage.getItem('name'),
      comment: localStorage.getItem('comment'),
      time: localStorage.getItem('time')
    };

    const message = `💳 Новая заявка:
Отдаёт: ${formatNumber(data.rub)} RUB
Получает: ${formatNumber(data.czk)} CZK
Курс: ${data.rate}
Способ: ${data.method}
Счёт: ${data.account}
Имя: ${data.name}
Комментарий: ${data.comment || '—'}
⏱ Время перевода: ${data.time}`;

    if (window.Telegram && Telegram.WebApp) {
      Telegram.WebApp.sendData(message);
    } else {
      alert('Telegram WebApp не доступен');
    }
  });
});
