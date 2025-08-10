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
    const time     = localStorage.getItem('time') || '-';

     let message = `Здравствуйте, я оставил заявку в приложении ⬇️\n\n`;

    if (flow === 'cash') {
      // Для наличных
      message +=
`*Заявка:* Наличные
*Сумма RUB:* ${rub}
*Сумма CZK:* ${czk}
*Курс:* ${rate}
*Время:* ${time}
*Имя:* ${name}`;
    } else {
      // Для перевода на счёт
      message +=
`*Заявка:* На счёт
*Сумма RUB:* ${rub}
*Сумма CZK:* ${czk}
*Курс:* ${rate}
*Счёт:* ${account}
*Имя:* ${name}
*Комментарий:* ${comment}`;
    }

    const encodedMessage = encodeURIComponent(message);

    // Открытие с автоподстановкой текста
    const chatUrl = `https://t.me/share/url?url=https://t.me/big_whipper&text=${encodedMessage}`;
    window.open(chatUrl, '_blank');
  });
});
