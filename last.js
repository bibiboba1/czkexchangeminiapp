console.log('LAST SCRIPT LOADED v9');

// утилиты
function formatNumber(n){ const num = Number(n); return Number.isFinite(num) ? num.toLocaleString('ru-RU') : '0'; }
function setText(id, v){ const el = document.getElementById(id); if (el) el.textContent = v ?? ''; }
function getLS(key, fallback='-'){ const v = localStorage.getItem(key); return (v === null || v === '') ? fallback : v; }
function getParams(){
  const p = new URLSearchParams(location.search);
  return {
    phone: (p.get('phone') || '').trim(),
    uid:   (p.get('uid')   || '').trim(),
    uname: (p.get('uname') || '').trim(),
    name:  (p.get('name')  || '').trim()
  };
}

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('confirmPage')) return;

  function getParams() {
  const p = new URLSearchParams(location.search);
  return {
    uid:   p.get('uid') || '',
    uname: p.get('uname') || '',
    name:  p.get('name') || '',
    phone: p.get('phone') || ''
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const qp = getParams();
  console.log('[URL params]', qp);

  // при отправке заявки включи их в payload:
  payload.user_id = qp.uid;
  payload.user_username = qp.uname;
  payload.user_name = qp.name;
  payload.phone = qp.phone;
});


  // Telegram WebApp SDK (если мини-апп открыт из чата)
  const tg = window.Telegram?.WebApp;
  try { tg?.ready(); tg?.expand?.(); } catch(e) {}
  const u = tg?.initDataUnsafe?.user || null;

  // Параметры, которые бот положил в URL (в т.ч. телефон)
  const qp = getParams();
  // На всякий — кэшнём телефон локально, чтобы не потерять при навигации
  if (qp.phone) localStorage.setItem('user_phone', qp.phone);

  // ----- наполнение экрана -----
  const raw = {
    flow:   localStorage.getItem('flow'),
    rub:    localStorage.getItem('rub') || 0,
    czk:    localStorage.getItem('czk') || 0,
    rate:   localStorage.getItem('rate') || '',
    acc:    localStorage.getItem('account') || '',
    method: localStorage.getItem('method'),
    time:   localStorage.getItem('time')
  };
  if (!raw.flow && !raw.method) { window.location.replace('index.html'); return; }

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

  // ----- отправка заявки -----
  const btn = document.querySelector('.btn-yellow');
  btn?.addEventListener('click', async () => {
    const payload = {
      flow:    getLS('flow', 'account'),
      method:  methodOut,
      rub:     getLS('rub', '0'),
      czk:     getLS('czk', '0'),
      rate:    getLS('rate', '-'),
      account: accOut,
      name:    getLS('name', '-'),
      comment: getLS('comment', '-'),
      time:    timeOut,

      // данные пользователя из Telegram WebApp (если открыт из чата)
      user_id:       u?.id ?? '',
      user_username: u?.username ?? '',
      user_name:     [u?.first_name, u?.last_name].filter(Boolean).join(''),

      // телефон и дубли из URL (бот их передал при открытии)
      phone:   qp.phone || localStorage.getItem('user_phone') || '',
      url_uid: qp.uid,
      url_uname: qp.uname,
      url_name: qp.name
    };

    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Отправляем...';

    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json?.error || 'Не удалось отправить заявку');
      window.location.href = 'success.html';
    } catch (e) {
      alert('Ошибка отправки: ' + e.message);
      console.error('[send] error:', e);
    } finally {
      btn.disabled = false;
      btn.textContent = original;
    }
  });
});








  
