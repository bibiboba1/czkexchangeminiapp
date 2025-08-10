document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('openChatBtn')?.addEventListener('click', () => {
    // Достаём данные
    const flow    = localStorage.getItem('flow') || '-';
    const rub     = localStorage.getItem('rub') || '-';
    const czk     = localStorage.getItem('czk') || '-';
    const rate    = localStorage.getItem('rate') || '-';
    const account = localStorage.getItem('account') || '-';
    const name    = localStorage.getItem('name') || '-';
    const comment = localStorage.getItem('comment') || '-';
    const time    = localStorage.getItem('time') || '-';

    let message = "Я совершил перевод, отправляю чек!\n";

    if (flow === 'cash') {
      // Наличные — без комментария, с временем
      message +=
`Заявка: Наличные
Сумма RUB: ${rub}
Сумма CZK: ${czk}
Курс: ${rate}
Время: ${time}
Имя: ${name}`;
    } else {
      // На счёт — с комментарием
      message +=
`Заявка: На счет
Сумма RUB: ${rub}
Сумма CZK: ${czk}
Курс: ${rate}
Счет: ${account}
Имя: ${name}
Комментарий: ${comment}`;
    }

    const encodedMessage = encodeURIComponent(message);

    // Переход сразу в чат с готовым текстом
    const chatUrl = `https://t.me/big_whipper?text=${encodedMessage}`;
    window.open(chatUrl, '_blank');
  });
});








