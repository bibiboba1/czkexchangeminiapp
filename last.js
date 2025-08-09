console.log('LAST SCRIPT LOADED v5');

// Форматирование чисел
function formatNumber(n) {
  const num = Number(n);
  return Number.isFinite(num) ? num.toLocaleString('ru-RU') : '0';
}

// Безопасная установка текста
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? '';
}

// Утилита для чтения из LS
function getLS(key, fallback = '-') {
  const v = localStorage.getItem(key);
  return (v === null || v === '') ? fallback : v;
}

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('confirmPage')) return;

  // Заполняем экран значениями
  const raw = {
    flow:   localStorage.getItem('flow'),
    rub:    localStorage.getItem('rub') || 0,
    czk:    localStorage.getItem('czk') || 0,
    rate:   localStorage.getItem('rate') || '',
    acc:    localStorage.getItem('account') || '',
    method: localStorage.getItem('method'),
    time:   localStorage.getItem('time')
  };

  const isCash   = raw.flow === 'cash' || raw.method === 'Наличные';
  const methodOut= isCash ? 'Наличные' : (raw.method || 'На счёт');
  const accOut   = isCash ? '-'        : raw.acc;
  const timeOut  = isCash ? (raw.time || '—') : (raw.time || 'до 24 часов');

  setText('rubAmount', formatNumber(raw.rub));
  setText('czkAmount', formatNumber(raw.czk));
  setText('rate',      raw.rate);
  setText('method',    methodOut);
  setText('acc',       accOut);
  setText('time',      timeOut);

  // ЕДИНСТВЕННЫЙ обработчик "Создать заявку"
  const btn = document.querySelector('.btn-yellow');
  btn?.addEventListener('click', async () => {
    const flow    = getLS('flow', 'account');
    const rub     = getLS('rub', '0');
    const czk     = getLS('czk', '0');
    const rate    = getLS('rate', '-');
    const method  = (flow === 'cash') ? 'Наличные' : 'На счёт';
    const account = (flow === 'cash') ? '-' : getLS('account', '-');
    const name    = getLS('name', '-');
    const comment = getLS('comment', '-');
    const time    = (flow === 'cash') ? getLS('time', '—') : getLS('time', 'до 1 часа');

    const payload = { flow, method, rub, czk, rate, account, name, comment, time };

    const t = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Отправляем...';

    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json.success) {
        throw new Error(json?.error || 'Не удалось отправить заявку');
      }

      // успешная отправка → экран успеха
      window.location.href = 'success.html';
    } catch (e) {
      alert('Ошибка отправки: ' + e.message);
      console.error('[send] error:', e);
    } finally {
      btn.disabled = false;
      btn.textContent = t;
    }
  });
});




  
