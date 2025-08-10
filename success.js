document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('openChatBtn')?.addEventListener('click', () => {
    // Готовое сообщение
    const message = 'Я совершил перевод, отправляю чек!';

    // Кодируем для URL
    const encodedMessage = encodeURIComponent(message);

    // Ссылка на чат с ботом и готовым текстом
    const chatUrl = `https://t.me/big_whipper?text=${encodedMessage}`;

    // Открываем чат
    window.open(chatUrl, '_blank');
  });
});








