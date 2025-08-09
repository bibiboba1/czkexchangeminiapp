// Поставь сюда ссылку на свой чат
const CHAT_URL = 'https://t.me/big_whipper'; // замени на реальный

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('openChat')?.addEventListener('click', () => {
    window.location.href = CHAT_URL;
  });
});
