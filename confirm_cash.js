// формат 20 000
function formatNumber(n){ return Number(n).toLocaleString('ru-RU'); }

document.addEventListener('DOMContentLoaded', () => {
  // данные из localStorage
  const rub      = localStorage.getItem('rub') || 0;
  const czk      = localStorage.getItem('czk') || 0;
  const rate     = localStorage.getItem('rate') || '';
  const method   = localStorage.getItem('method') || 'Наличные';
  const datetime = localStorage.getItem('time') || '';

  // подставляем в разметку
  document.getElementById('rubAmount').textContent = formatNumber(rub);
  document.getElementById('czkAmount').textContent = formatNumber(czk);
  document.getElementById('rate').textContent      = rate;
  document.getElementById('method').textContent    = method;
  document.getElementById('datetime').textContent  = datetime || '—';

  // отправка заявки
  const btn = document.querySelector('.btn-yellow');
  btn?.addEventListener('click', async () => {
    if (!datetime){
      alert('Пожалуйста, выберите дату и время на предыдущей странице.');
      return;
    }

    btn.disabled = true;
    const t = btn.textContent;
    btn.textContent = 'Отправляем...';

    const payload = {
      rub, czk, rate,
      method,                    // 'Наличные'
      account: '-',              // для кэша счёта нет
      name: localStorage.getItem('name') || '-',
      comment: localStorage.getItem('comment') || '',
      time: datetime             // Дата и время
    };

    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        alert('Заявка отправлена!');
      } else {
        alert('Ошибка: ' + (json?.data?.description || 'Неизвестная ошибка'));
      }
    } catch(e){
      alert('Сервер не отвечает: ' + e.message);
    } finally {
      btn.disabled = false;
      btn.textContent = t;
    }
  });
});
