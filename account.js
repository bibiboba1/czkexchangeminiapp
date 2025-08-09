// account.js — страница ввода реквизитов "На счёт"
localStorage.setItem('flow', 'account');

// Очищаем данные от ветки "Наличные"
localStorage.removeItem('time');
localStorage.removeItem('method');

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
    const time = 'до 24 часов';

    // Сохраняем в localStorage
    localStorage.setItem('account', account);
    localStorage.setItem('name', name);
    localStorage.setItem('comment', comment);
    localStorage.setItem('rub', rub);
    localStorage.setItem('czk', czk);
    localStorage.setItem('rate', rate);
    localStorage.setItem('method', method);
    localStorage.setItem('time', time);

    // Переход с параметром, чтобы избежать кеша
    window.location.href = `last.html?nocache=${Date.now()}`;
  });

  // Скрыть клавиатуру при клике вне input
  document.addEventListener('click', (e) => {
    if (!e.target.closest('input')) {
      document.activeElement.blur();
    }
  });
});

