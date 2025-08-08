document.addEventListener('DOMContentLoaded', () => {
  // Заполнение полей
  document.getElementById('rubAmount').textContent = localStorage.getItem('rub') || '';
  document.getElementById('czkAmount').textContent = localStorage.getItem('czk') || '';
  document.getElementById('rate').textContent = localStorage.getItem('rate') || '';
  document.getElementById('method').textContent = localStorage.getItem('method') || '';
  document.getElementById('acc').textContent = localStorage.getItem('account') || '';
  document.getElementById('username').textContent = localStorage.getItem('name') || '';
  document.getElementById('commentText').textContent = localStorage.getItem('comment') || '';
  document.getElementById('time').textContent = localStorage.getItem('time') || '';

  // Кнопка "Создать заявку"
  document.querySelector('.btn-yellow').addEventListener('click', () => {
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
Отдаёт: ${data.rub} RUB
Получает: ${data.czk} CZK
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
