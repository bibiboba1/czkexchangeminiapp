document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('openChatBtn')?.addEventListener('click', () => {
    const flow    = localStorage.getItem('flow') || '-';      // 'cash' | 'account'
    const rub     = localStorage.getItem('rub') || '-';
    const czk     = localStorage.getItem('czk') || '-';
    const rate    = localStorage.getItem('rate') || '-';
    const account = localStorage.getItem('account') || '-';
    const time    = localStorage.getItem('time') || '-';
    const name    = localStorage.getItem('name') || '-';
    const comment = localStorage.getItem('comment') || '-';

    let message = 'Здравствуйте!\nЯ оставил заявку на обмен ⬇️\n\n';

    if (flow === 'cash') {
      // Наличные: вместо счёта показываем время
      message +=
`Заявка: Наличные
Сумма RUB: ${rub}
Сумма CZK: ${czk}
Курс: ${rate}
Время: ${time}`;
    } else {
      // На счёт: показываем счёт
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

    // Единый рабочий вариант — через share/url
    const chatUrl = `https://t.me/share/url?url=https://t.me/big_whipper&text=${encodedMessage}`;
    window.open(chatUrl, '_blank');
  });
});



