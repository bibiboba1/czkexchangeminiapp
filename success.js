document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('openChatBtn')?.addEventListener('click', () => {
    // Достаём данные, которые сохранили на предыдущих страницах
    const flow     = localStorage.getItem('flow') || '-';
    const rub      = localStorage.getItem('rub') || '-';
    const czk      = localStorage.getItem('czk') || '-';
    const rate     = localStorage.getItem('rate') || '-';
    const account  = flow === 'cash' ? '-' : (localStorage.getItem('account') || '-');
    const name     = localStorage.getItem('name') || '-';
    const comment  = localStorage.getItem('comment') || '-';
    const time    = localStorage.getItem('time') || '-';

    // Формируем текст для чата
    const message =
`Здравствуйте!\nЯ оставил заявку на обмен!⬇️\n
Заявка: ${flow === 'cash' ? 'Наличные' : 'На счет'}
Сумма RUB: ${rub}
Сумма CZK: ${czk}
Курс: ${rate}
Счет: ${account}
Время: ${time}`;

    // Кодируем для ссылки
    const encodedMessage = encodeURIComponent(message);

    // Открываем чат с готовым текстом
    const chatUrl = `https://t.me/big_whipper?text=${encodedMessage}`;
    window.open(chatUrl, '_blank');
  });
});








