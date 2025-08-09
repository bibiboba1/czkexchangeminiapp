document.addEventListener('DOMContentLoaded', () => {
  // На счёт
  document.getElementById('toAccount')?.addEventListener('click', () => {
    localStorage.setItem('flow', 'account');
    localStorage.removeItem('time');      // на всякий, чтобы не тащилось из cash
    window.location.href = 'account.html';
  });

  // Наличные
  document.getElementById('toCash')?.addEventListener('click', () => {
    localStorage.setItem('flow', 'cash');
    localStorage.removeItem('account');   // чтобы не тащилось из account
    localStorage.removeItem('name');
    window.location.href = 'cash.html';
  });

  // Назад
  document.getElementById('goBack')?.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
});


