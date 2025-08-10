console.log('LAST SCRIPT LOADED v11');

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
    time:   localStorage.getItem('time'),
    name:   localStorage.getItem('name') || '-',       // если где-то заполняется
    comment:localStorage.getItem('comment') || '-'     // если где-то заполняется
  };

  // Если данных нет — возвращаем на старт
  if (!raw.flow && !raw.method) {
    window.location.replace('index.html');
    return;
  }

  // Выводимые значения
  const isCash    = raw.flow === 'cash' || raw.method === 'Наличные';
  const methodOut = isCash ? 'Наличные' : (raw.method || 'На счёт');
  const accOut    = isCash ? '-'        : (raw.acc || '-');
  const timeOut   = isCash ? (raw.time || '—') : (raw.time || 'До 24 часов');

  // Заполняем страницу
  setText('rubAmount', formatNumber(raw.rub));
  setText('czkAmount', formatNumber(raw.czk));
  setText('rate',      raw.rate);
  setText('method',    methodOut);
  setText('acc',       accOut);
  setText('time',      timeOut);

  async function sendOrderToApi() {
    // на всякий случай подхватим сумму с экрана, если не сохранили
    const rubEl = document.getElementById('rubAmount');
    if (rubEl && !localStorage.getItem('rub')) {
      const val = (rubEl.textContent || '').replace(/\s/g, '').replace(',', '.');
      if (val) localStorage.setItem('rub', val);
    }

    const body = {
      // заявка
      flow:   raw.flow || 'account',
      method: methodOut,
      rub:    String(localStorage.getItem('rub') || raw.rub || '0'),
      czk:    String(localStorage.getItem('czk') || raw.czk || '0'),
      rate:   String(localStorage.getItem('rate') || raw.rate || '-'),
      account: accOut,
      name:    raw.name,
      comment: raw.comment,
      time:    timeOut,

      // пользователь из WebApp
      user_id:       u?.id ? String(u.id) : '',
      user_username: u?.username || '',
      user_name:     [u?.first_name, u?.last_name].filter(Boolean).join(' '),

      // запасные варианты (URL/кэш)
      phone:    localStorage.getItem('user_phone') || qp.phone || '',
      url_uid:  qp.uid,
      url_uname:qp.uname,
      url_name: qp.name,
      initData: tg?.initData || ""

    };

    const res = await fetch('/api/send', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(body)
    });

    const data = await res.json().catch(()=> ({}));
    if (!res.ok || data.success === false) {
      throw new Error(data.error || `HTTP ${res.status}`);
    }
  }

  const btn = document.querySelector('.btn-yellow');
  btn?.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      await sendOrderToApi();
      window.location.href = 'success.html';
    } catch (err) {
      console.error('Ошибка отправки заявки:', err);
      if (tg?.showPopup) {
        tg.showPopup({title: 'Ошибка', message: String(err), buttons: [{type:'ok'}]});
      } else {
        alert('Не удалось отправить: ' + err);
      }
    }
  });
});










  
