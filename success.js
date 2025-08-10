document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('openChatBtn')?.addEventListener('click', () => {
    const flow    = localStorage.getItem('flow') || '-';
    const rub     = localStorage.getItem('rub') || '-';
    const czk     = localStorage.getItem('czk') || '-';
    const rate    = localStorage.getItem('rate') || '-';
    const account = localStorage.getItem('account') || '-';
    const time    = localStorage.getItem('time') || '-';

    const message = 
`Здравствуйте!
Я оставил заявку на обмен ⬇️

Заявка: ${flow === 'cash' ? 'Наличные' : 'На счет'}
Сумма RUB: ${rub}
Сумма CZK: ${czk}
Курс: ${rate}
Время: ${time}
Счет: ${account}`;

    const encodedMessage = encodeURIComponent(message);

    // Открываем Telegram с уже готовым текстом в чате @big_whipper
    const chatUrl = `https://t.me/big_whipper?text=${encodedMessage}`;
    window.open(chatUrl, '_blank');
  });
});








