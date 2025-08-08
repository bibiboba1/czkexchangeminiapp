document.addEventListener('DOMContentLoaded', () => {
  // На счёт
  document.getElementById('toAccount')?.addEventListener('click', () => {
    localStorage.setItem('flow', 'account');   // ставим флаг ветки
    // на всякий — очищаем данные от "Наличных"
    localStorage.removeItem('time');
    window.location.href = 'account.html';
  });

  // Наличные
  document.getElementById('toCash')?.addEventListener('click', () => {
    localStorage.setItem('flow', 'cash');      // ставим флаг ветки
    // чистим данные от "На счёт", чтобы не подтягивались
    localStorage.removeItem('account');
    localStorage.removeItem('name');
    window.location.href = 'cash.html';
  });

  // Назад
  document.getElementById('goBack')?.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
});

