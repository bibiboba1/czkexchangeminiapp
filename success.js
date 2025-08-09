document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('openChat')?.addEventListener('click', () => {
    const flow     = localStorage.getItem('flow') || '-';
    const rub      = localStorage.getItem('rub') || '-';
    const czk      = localStorage.getItem('czk') || '-';
    const rate     = localStorage.getItem('rate') || '-';
    const account  = flow === 'cash' ? '-' : (localStorage.getItem('account') || '-');
    const name     = localStorage.getItem('name') || '-';
    const comment  = localStorage.getItem('comment') || '-';

    const message = 
`Заявка: ${flow === 'cash' ? 'Наличные' : 'На счет'}
Сумма RUB: ${rub}
Сумма CZK: ${czk}
Курс: ${rate}
Счет: ${account}
Имя: ${name}
Комментарий: ${comment}`;

    const encodedMessage = encodeURIComponent(message);

    // Формируем ссылку для Telegram
    const chatUrl = `https://t.me/share/url?url=&text=${encodedMessage}`;

    window.open(chatUrl, '_blank');
  });
});

