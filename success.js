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
      // Наличные: вместо счёта показываем время, без комментария/счёта
      message +=
`Заявка: Наличные
Сумма RUB: ${rub}
Сумма CZK: ${czk}
Курс: ${rate}
Время: ${time}`;
    } else {
      // На счёт: показываем счёт, можно добавить имя/комментарий при желании
      message +=
`Заявка: На счет
Сумма RUB: ${rub}
Сумма CZK: ${czk}
Курс: ${rate}
Счет: ${account}`;
      // Если хочешь, раскомментируй строки ниже:
      // message += `\nИмя: ${name}`;
      // message += `\nКомментарий: ${comment}`;
    }

    const encodedMessage = encodeURIComponent(message);
    const chatUrl = `https://t.me/big_whipper?text=${encodedMessage}`;
    window.open(chatUrl, '_blank');
  });
});







