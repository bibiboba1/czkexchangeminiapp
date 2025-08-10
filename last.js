console.log('LAST SCRIPT LOADED v10');

// утилиты
function formatNumber(n) {
  const num = Number(n);
  return Number.isFinite(num) ? num.toLocaleString('ru-RU') : '0';
}
function setText(id, v) {
  const el = document.getElementById(id);
  if (el) el.textContent = v ?? '';
}
function getLS(key, fallback = '-') {
  const v = localStorage.getItem(key);
  return (v === null || v === '') ? fallback : v;
}
function getParams() {
  const p = new URLSearchParams(location.search);
  return {
    uid:   (p.get('uid') || '').trim(),
    uname: (p.get('uname') || '').trim(),
    name:  (p.get('name') || '').trim(),
    phone: (p.get('phone') || '').trim()
  };
}

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('confirmPage')) return;

  // Telegram WebApp SDK
  const tg = window.Telegram?.WebApp;
  try { tg?.ready(); tg?.expand?.(); } catch (e) {}
  const u = tg?.initDataUnsafe?.user || null;

  // Параметры из URL
  const qp = getParams();
  if (qp.phone) localStorage.setItem('user_phone', qp.phone);

  // Данные из localStorage
  const raw = {
    flow:   localStorage.getItem('flow'),
    rub:    localStorage.getItem('rub') || 0,
    czk:    localStorage.getItem('czk') || 0,
    rate:   localStorage.getItem('rate') || '',
    acc:    localStorage.getItem('account') || '',
    method: localStorage.getItem('method'),
    time:   localStorage.getItem('time')
  };

  // Если данных нет — возвращаем на старт
  if (!raw.flow && !raw.method) {
    window.location.replace('index.html');
    return;
  }

  // Определяем выводимые значения
  const isCash    = raw.flow === 'cash' || raw.method === 'Наличные';
  const methodOut = isCash ? 'Наличные' : (raw.method || 'На счёт');
  const accOut    = isCash ? '-'        : raw.acc;
  const timeOut   = isCash ? (raw.time || '—') : (raw.time || 'До 24 часов');

  // Заполняем страницу
  setText('rubAmount', formatNumber(raw.rub));
  setText('czkAmount', formatNumber(raw.czk));
  setText('rate',      raw.rate);
  setText('method',    methodOut);
  setText('acc',       accOut);
  setText('time',      timeOut);

  // Обработчик кнопки
  const btn = document.querySelector('.btn-yellow');
  btn?.addEventListener('click', (e) => {
    e.preventDefault();

    const flow = localStorage.getItem('flow');
    if (flow === 'account') {
      // Сохраняем сумму, если ещё не сохранена
      const rubEl = document.getElementById('rubAmount');
      if (rubEl && !localStorage.getItem('rub')) {
        const val = (rubEl.textContent || '').replace(/\s/g, '').replace(',', '.');
        if (val) localStorage.setItem('rub', val);
      }
      window.location.href = 'payment.html';
    } else {
      // Для наличных сразу на success.html
      window.location.href = 'success.html';
    }
  });
});









  
