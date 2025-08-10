document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('openChatBtn')?.addEventListener('click', () => {
    const flow     = localStorage.getItem('flow') || '-';
    const rub      = localStorage.getItem('rub') || '-';
    const czk      = localStorage.getItem('czk') || '-';
    const rate     = localStorage.getItem('rate') || '-';
    const account  = flow === 'cash' ? '-' : (localStorage.getItem('account') || '-');
    const name     = localStorage.getItem('name') || '-';
    const comment  = localStorage.getItem('comment') || '-';

    // Формируем HTML-текст с жирными заголовками
    const message =
`Здравствуйте, я оставил заявку в приложении ⬇️

*Заявка:* ${flow === 'cash' ? 'Наличные' : 'На счет'}
*Сумма RUB:* ${rub}
*Сумма CZK:* ${czk}
*Курс:* ${rate}
*Счет:* ${account}
*Имя:* ${name}
*Комментарий:* ${comment}`;

    const encodedMessage = encodeURIComponent(message);

    // Ссылка с режимом HTML
    const chatUrl = `https://t.me/big_whipper?text=${encodedMessage}&parse_mode=HTML`;
    window.open(chatUrl, '_blank');
  });
});

