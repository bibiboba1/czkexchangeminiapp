// /last.js
console.log('LAST SCRIPT LOADED v14');

const API_BASE = 'czkexchangeminiapp.vercel.app'; // если фронт НЕ на том же домене, укажи абсолютный URL, напр. 'https://yourapp.vercel.app'
const BOT_USERNAME = 'innnntro_bot'; // без @ — замени на реальный username бота

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

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('confirmPage');
  if (!root) {
    console.warn('confirmPage not found');
    return;
  }

  // Telegram WebApp SDK (безопасно, даже если не в Telegram)
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
      flow:    raw.flow || 'account',
      method:  methodOut,
      rub:     String(localStorage.getItem('rub') || raw.rub || rubFromUI || '0'),
      czk:     String(localStorage.getItem('czk') || raw.czk || '0'),
      rate:    String(localStorage.getItem('rate') || raw.rate || '-'),
      account: accOut,
      name:    raw.name,
      comment: raw.comment,
      time:    timeOut,

      user: userUnsafe,
      user_id:       String(localStorage.getItem('tg_user_id') || userUnsafe?.id || ''),
      user_username: localStorage.getItem('tg_username') || userUnsafe?.username || '',
      user_name: [
        localStorage.getItem('tg_first_name') || userUnsafe?.first_name || '',
        localStorage.getItem('tg_last_name')  || userUnsafe?.last_name  || ''
      ].filter(Boolean).join(' '),

      phone:     localStorage.getItem('user_phone') || qp.phone || '',
      url_uid:   qp.uid,
      url_uname: qp.uname,
      url_name:  qp.name,

      initData: tg?.initData || localStorage.getItem('tg_initData') || ''
    };
  }

  async function sendOrderToApi(payload) {
    const url = (API_BASE ? API_BASE : '') + '/api/send';
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

  const btn = document.querySelector('.btn-yellow');
  if (!btn) {
    console.error('Submit button .btn-yellow not found');
    return;
  }

  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    console.log('[submit] click');
    btn.disabled = true;

    const payload = buildPayload();
    console.log('[submit] payload:', payload);

    try {
      // 1) Просим право писать (только если есть tg)
      if (tg?.requestWriteAccess) {
        tg.requestWriteAccess((granted) => {
          console.log('[submit] write access:', granted);
          if (!granted && tg?.openTelegramLink && BOT_USERNAME && BOT_USERNAME !== 'YourRealBot') {
            tg.openTelegramLink(`https://t.me/${BOT_USERNAME}?start=lead`);
          }
        });
      }

      // 2) Шлём сервисное сообщение боту (не блокирует процесс)
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

      // 3) Отправляем на сервер (Vercel)
      await sendOrderToApi(payload);
      console.log('[submit] API ok');

      // 4) Переходим к оплате
      window.location.href = 'payment.html';

    } catch (err) {
      console.error('[submit] error:', err);
      if (tg?.showPopup) {
        tg.showPopup({ title: 'Ошибка', message: String(err), buttons: [{ type: 'ok' }] });
      } else {
        alert('Не удалось отправить заявку: ' + err);
      }
    } finally {
      btn.disabled = false; // всегда возвращаем кнопку
    }
  });
});


