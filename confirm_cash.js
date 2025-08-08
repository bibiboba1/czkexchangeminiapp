// Формат 20 000
function formatNumber(n){ return Number(n).toLocaleString('ru-RU'); }

document.addEventListener('DOMContentLoaded', () => {
  // Подставляем значения на экран
  const rub = localStorage.getItem('rub') || 0;
  const czk = localStorage.getItem('czk') || 0;
  const rate = localStorage.getItem('rate') || '';
  const method = localStorage.getItem('method') || 'Наличные';
  const datetime = localStorage.getItem('time') || '';

  document.getElementById('rubAmount').textContent = formatNumber(rub);
  document.getElementById('czkAmount').textContent = formatNumber(czk);
  document.getElementById('rate').textContent      = rate;
  document.getElementById('method').textContent    = method;
  document.getElementById('datetime').textContent  = datetime || '—';

  // Отправка заявки в телеграм через /api/send
  const btn = document.querySelector('.btn-yellow');
  btn?.addEventListener('click', async () => {
    // базовая проверка
    if (!datetime) {
      alert('Пожалуйста, выберите дату и время на предыдущей странице.');
      return;
    }

    // блокируем повторные клики
    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = 'Отправляем...';

    const payload = {
      rub,                          // можно отправлять сырые числа
      czk,
      rate,
      method,
      account: '-',                 // для наличных счёта нет
      name: localStorage.getItem('name') || '-',
      comment: localStorage.getItem('comment') || '',
      time: datetime                // здесь «Дата и время»
    };

    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (result.success) {
        alert('Заявка отправлена!');
        // по желанию: очистить локальные данные или перейти на страницу «Готово»
        // localStorage.removeItem('time');
        // window.location.href = 'done.html';
      } else {
        alert('Ошибка при отправке: ' + (result?.data?.description || 'Неизвестная ошибка'));
      }
    } catch (err) {
      alert('Сервер не отвечает: ' + err.message);
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });
});
