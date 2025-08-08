// формат 20 000
function formatNumber(n){ return Number(n).toLocaleString('ru-RU'); }

document.addEventListener('DOMContentLoaded', () => {
  // подставляем значения
  document.getElementById('rubAmount').textContent = formatNumber(localStorage.getItem('rub') || 0);
  document.getElementById('czkAmount').textContent = formatNumber(localStorage.getItem('czk') || 0);
  document.getElementById('rate').textContent      = localStorage.getItem('rate') || '';
  document.getElementById('method').textContent    = localStorage.getItem('method') || 'Наличные';
  document.getElementById('datetime').textContent  = localStorage.getItem('time') || '—';

  // отправка заявки в телеграм через /api/send
  document.querySelector('.btn-yellow')?.addEventListener('click', async () => {
    const data = {
      rub: localStorage.getItem('rub'),
      czk: localStorage.getItem('czk'),
      rate: localStorage.getItem('rate'),
      method: localStorage.getItem('method') || 'Наличные',
      // для кэша отправляем одно поле time как "Дата и время"
      account: '-',           // здесь счёта нет
      name: localStorage.getItem('name') || '-',
      comment: localStorage.getItem('comment') || '',
      time: localStorage.getItem('time') || '-'
    };

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
        alert('Ошибка при отправке: ' + (result?.data?.description || 'Неизвестная ошибка'));
      }
    } catch (err) {
      alert('Сервер не отвечает: ' + err.message);
    }
  });
});
