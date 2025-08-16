// /last.js
console.log('LAST SCRIPT LOADED v16');

const API_BASE = 'https://czkexchangeminiapp.vercel.app'; // полный URL твоего backend (Vercel)
const BOT_USERNAME = 'innnntro_bot'; // username бота без @

// ── утилиты ───────────────────────────────────────────────────────────────────
function formatNumber(n) {
  const num = Number(n);
  return Number.isFinite(num) ? num.toLocaleString('ru-RU') : '0';
}
function setText(id, v) {
  const el = document.getElementById(id);
  if (el) el.textContent = v ?? '';
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
function alertErr(prefix, err) {
  const msg = `[${prefix}] ${String(err?.message || err)}`;
  console.error(msg);
  try { alert(msg); } catch {}
}

// ── основной код ──────────────────────────────────────────────────────────────
function init() {
  const root = document.getElementById('confirmPage');
  if (!root) {
    console.warn('confirmPage not found');
    return;
  }

  // Telegram WebApp SDK (безопасно, даже если вне Telegram)
  const tg = (window.Telegram && window.Telegram.WebApp) ? window.Telegram.WebApp : null;
  try { tg && tg.ready(); tg && tg.expand && tg.expand(); } catch (e) { console.warn(e); }

  const qp = getParams();
  if (qp.phone) localStorage.setItem('user_phone', qp.phone);

  const raw = {
    flow:    localStorage.getItem('flow'),
    rub:     localStorage.getItem('rub') || 0,
    czk:     localStorage.getItem('czk') || 0,
    rate:    localStorage.getItem('rate') || '',
    acc:     localStorage.getItem('account') || '',
    method:  localStorage.getItem('method'),
    time:    localStorage.getItem('time'),
    name:    localStorage.getItem('name') || '-',
    comment: localStorage.getItem('comment') || '-'
  };

  if (!raw.flow && !raw.method) {
    console.warn('no flow/method -> redirect index.html');
    window.location.replace('index.html');
    return;
  }

  const isCash    = raw.flow === 'cash' || raw.method === 'Наличные';
  const methodOut = isCash ? 'Наличные' : (raw.method || 'На счёт');
  const accOut    = isCash ? 'Не требуется' : (raw.acc || '-');
  const timeOut   = isCash ? (raw.time || '—') : (raw.time || 'До 24 часов');

  setText('rubAmount', formatNumber(raw.rub));
  setText('czkAmount', formatNumber(raw.czk));
  setText('rate',      raw.rate);
  setText('method',    methodOut);
  setText('acc',       accOut);
  setText('time',      timeOut);

  function buildPayload() {
    const userUnsafe = tg?.initDataUnsafe?.user || null;
    const rubFromUI = (document.getElementById('rubAmount')?.textContent || '')
      .replace(/\s/g, '')
      .replace(',', '.');

    return {
      // заявка
      flow:    raw.flow || 'account',
      method:  methodOut,
      rub:     String(localStorage.getItem('rub') || raw.rub || rubFromUI || '0'),
      czk:     String(localStorage.getItem('czk') || raw.czk || '0'),
      rate:    String(localStorage.getItem('rate') || raw.rate || '-'),
      account: accOut,
      name:    raw.name,
      comment: raw.comment,
      time:    timeOut,

      // данные пользователя
      user: userUnsafe,
      user_id:       String(localStorage.getItem('tg_user_id') || userUnsafe?.id || ''),
      user_username: localStorage.getItem('tg_username') || userUnsafe?.username || '',
      user_name: [
        localStorage.getItem('tg_first_name') || userUnsafe?.first_name || '',
        localStorage.getItem('tg_last_name')  || userUnsafe?.last_name  || ''
      ].filter(Boolean).join(' '),

      // запасные варианты (URL/кэш)
      phone:     localStorage.getItem('user_phone') || qp.phone || '',
      url_uid:   qp.uid,
      url_uname: qp.uname,
      url_name:  qp.name,

      // initData из Telegram WebApp (на бэке проверить подпись!)
      initData: tg?.initData || localStorage.getItem('tg_initData') || ''
    };
  }

  async function pingApi() {
    try {
      const r = await fetch(`${API_BASE}/api/send`, {
        method: 'OPTIONS',
        headers: { 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type' }
      });
      if (!r.ok) throw new Error(`API preflight ${r.status}`);
      console.log('[ping] API preflight OK');
    } catch (e) {
      alertErr('API недоступно', e);
    }
  }

  async function sendOrderToApi(payload) {
    const url = `${API_BASE}/api/send`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.success === false) {
      throw new Error(data.error || `HTTP ${res.status}`);
    }
    return data;
  }

  // предварительная проверка доступности API (не обязательно, но удобно)
  pingApi();

  const btn = document.querySelector('.btn-yellow');
  if (!btn) {
    alertErr('UI', 'Кнопка .btn-yellow не найдена на странице');
    return;
  }

  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    console.log('[submit] click');
    btn.disabled = true;

    const payload = buildPayload();
    console.log('[submit] payload:', payload);

    try {
      // 1) запросить право писать пользователю
      if (tg?.requestWriteAccess) {
        tg.requestWriteAccess((granted) => {
          console.log('[submit] write access:', granted);
          if (!granted && tg?.openTelegramLink && BOT_USERNAME) {
            tg.openTelegramLink(`https://t.me/${BOT_USERNAME}?start=lead`);
          }
        });
      }

      // 2) отправить сервисное сообщение боту
      try {
        if (tg?.sendData) {
          tg.sendData(JSON.stringify({ type: 'lead', ...payload }));
          console.log('[submit] sendData sent');
        } else {
          console.log('[submit] sendData not available (not in Telegram)');
        }
      } catch (sdErr) {
        console.warn('[submit] sendData error:', sdErr);
      }

      // 3) отправить на сервер (Vercel)
      await sendOrderToApi(payload);
      console.log('[submit] API ok');

      // 4) переход к оплате
      window.location.href = 'payment.html';

    } catch (err) {
      alertErr('Отправка заявки', err);
    } finally {
      btn.disabled = false;
    }
  });
}

// инициализация надёжно: если DOM уже готов — запускаем сразу
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}




