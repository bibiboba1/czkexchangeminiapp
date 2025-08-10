document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('openChat')?.addEventListener('click', () => {
    // Готовое сообщение для пользователя
    const message = 'Я совершил перевод, отправляю чек!';

    // Кодируем для URL
    const encodedMessage = encodeURIComponent(message);

    // Ссылка на чат с ботом и готовым текстом
    const chatUrl = `https://t.me/innnntro_bot?text=${encodedMessage}`;

    // Открываем чат
    window.open(chatUrl, '_blank');
  });
});


