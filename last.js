console.log('LAST SCRIPT LOADED v6');

// формат числа
function formatNumber(n) {
  const num = Number(n);
  return Number.isFinite(num) ? num.toLocaleString('ru-RU') : '0';
}
// безопасная подстановка
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? '';
}
// чтение LS с дефолтом
function getLS(key, fallback = '-') {
  const v = localStorage.getItem(key);
  return (v === null || v === '') ? fallback : v;
}

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('confirmPage')) return;

  // ----- заполняем экран значениями -----
  const raw = {
    flow:   localStorage.getItem('flow'),
    rub:    localStorage.getItem('rub') || 0,
    czk:    localStorage.getItem('czk') || 0,
    rate:   localStorage.getItem('rate') || '',
    acc:    localStorage.getItem('account') || '',
    method: localStorage.getItem('method'),
    time:   localStorage.getItem('time')
  };
  const isCash    = raw.flow === 'cash' || raw.method === 'Наличные';
  const methodOut = isCash ? 'Наличные' : (raw.method || 'На счёт');
  const accOut    = isCash ? '-'        : raw.acc;
  const timeOut   = isCash ? (raw.time || '—') : (raw.time || 'До 24 часов');

  setText('rubAmount', formatNumber(raw.rub));
  setText('czkAmount', formatNumber(raw.czk));
  setText('rate',      raw.rate);
  setText('method',    methodOut);
  setText('acc',       accOut);
  setText('time',      timeOut);

  // ----- данные пользователя из Telegram Mini App -----
  const tg = window.Telegram?.WebApp;
  const tgUser = tg?.initDataUnsafe?.user || null;

  // Сохраним в LS как запасной вариант (на случай повторного клика)
  if (tgUser) {
    localStorage.setItem('tg_user_id', String(tgUser.id));
    if (tgUser.username)   localStorage.setItem('tg_username', tgUser.username);
    if (tgUser.first_name) localStorage.setItem('tg_first_name', tgUser.first_name);
    if (tgUser.last_name)  localStorage.setItem('tg_last_name', tgUser.last_name);
  }

  // ЕДИНСТВЕННЫЙ обработчик "Создать заявку"
  const btn = document.querySelector('.btn-yellow');
  btn?.addEventListener('click', async () => {
    const flow      = getLS('flow', 'account');
    const rub       = getLS('rub', '0');
    const czk       = getLS('czk', '0');
    const rate      = getLS('rate', '-');
    const method    = (flow === 'cash') ? 'Наличные' : 'На счёт';
    const account   = (flow === 'cash') ? '-' : getLS('account', '-');
    const name      = getLS('name', '-');
    const comment   = getLS('comment', '-');
    const time      = (flow === 'cash') ? getLS('time', '—') : getLS('time', 'До 24 часов');

    // user info (из WebApp или из LS)
    const user_id    = tgUser?.id ?? getLS('tg_user_id', '');
    const username   = tgUser?.username ?? getLS('tg_username', '');
    const first_name = tgUser?.first_name ?? getLS('tg_first_name', '');
    const last_name  = tgUser?.last_name ?? getLS('tg_last_name', '');

    const payload = {
      flow, method, rub, czk, rate, account, name, comment, time,
      user: {
        id: user_id,
        username,
        first_name,
        last_name
      }
    };

    const t = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Отправляем...';

    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        throw new Error(json?.error || 'Не удалось отправить заявку');
      }
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





  
