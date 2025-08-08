localStorage.setItem('flow', 'account');

document.addEventListener('DOMContentLoaded', () => {
  // Кнопка Далее
  document.getElementById('goNext')?.addEventListener('click', () => {
    const account = document.getElementById('accountNumber').value;
    const name = document.getElementById('fullName').value;
    const comment = document.getElementById('comment').value;

    // Примерные значения, которые можно доработать
    const rub = localStorage.getItem('rub') || '1000';
    const czk = localStorage.getItem('czk') || '250';
    const rate = localStorage.getItem('rate') || '3.95';
    const method = 'На счёт';
    const time = 'до 1 часа';

    // Сохраняем в localStorage
    localStorage.setItem('account', account);
    localStorage.setItem('name', name);
    localStorage.setItem('comment', comment);
    localStorage.setItem('rub', rub);
    localStorage.setItem('czk', czk);
    localStorage.setItem('rate', rate);
    localStorage.setItem('method', method);
    localStorage.setItem('time', time);

    window.location.href = 'confirm.html';
  });

  // Скрыть клавиатуру
  document.addEventListener('click', (e) => {
    if (!e.target.closest('input')) {
      document.activeElement.blur();
    }
  });
});
