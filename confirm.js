console.log('confirm.js LOADED, flow=', localStorage.getItem('flow'));

// Форматирование чисел с пробелами (например: 20 000)
function formatNumber(n) {
  return Number(n).toLocaleString('ru-RU');
}

document.addEventListener('DOMContentLoaded', () => {
  // Подставляем значения в элементы
  document.getElementById('rubAmount').textContent = formatNumber(localStorage.getItem('rub') || 0);
  document.getElementById('czkAmount').textContent = formatNumber(localStorage.getItem('czk') || 0);
  document.getElementById('rate').textContent = localStorage.getItem('rate') || '';
  document.getElementById('method').textContent = localStorage.getItem('method') || '';
  document.getElementById('acc').textContent = localStorage.getItem('account') || '';
  document.getElementById('username').textContent = localStorage.getItem('name') || '';
  document.getElementById('commentText').textContent = localStorage.getItem('comment') || '';
  document.getElementById('time').textContent = localStorage.getItem('time') || '';

  // Обработка клика по кнопке "Создать заявку"
  document.querySelector('.btn-yellow')?.addEventListener('click', async () => {
  const data = {
    rub: localStorage.getItem('rub'),
    czk: localStorage.getItem('czk'),
    rate: localStorage.getItem('rate'),
    method: localStorage.getItem('method'),
    account: localStorage.getItem('account'),
    name: localStorage.getItem('name'),
    comment: localStorage.getItem('comment'),
    time: localStorage.getItem('time')
  };

  console.log('Отправка...', data); // ← добавь для отладки

  try {
    const res = await fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.success) {
      alert('Заявка отправлена!');
    } else {
      alert('Ошибка: ' + (result?.data?.description || 'Неизвестная'));
    }
  } catch (err) {
    alert('Сервер не отвечает: ' + err.message);
    }
  });
});
