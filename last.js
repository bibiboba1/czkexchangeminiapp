console.log('LAST SCRIPT LOADED v13');

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
  if (!document.getElementById('confirmPage')) return;

  // Telegram WebApp SDK
  const tg = window.Telegram?.WebApp;
  try { tg?.ready(); tg?.expand?.(); } catch (e) {}

  // Параметры из URL
  const qp = getParams();
  if (qp.phone) localStorage.setItem('user_phone', qp.phone);

  // Данные из localStorage
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

  // Если данных нет — возвращаем на старт
  if (!raw.flow && !raw.method) {
    window.location.replace('index.html');
    return;
  }

  // Вычислим видимые значения
  const isCash    = raw.flow === 'cash' || raw.method === 'Наличные';
  const methodOut = isCash ? 'Наличные' : (raw.method || 'На счёт');
  // Если наличные — пишем "Не требуется" вместо номера счёта
  const accOut    = isCash ? 'Не требуется' : (raw.acc || '-');
  const timeOut   = isCash ? (raw.time || '—') : (raw.time || 'До 24 часов');

  // Заполняем страницу
  setText('rubAmount', formatNumber(raw.rub));
  setText('czkAmount', formatNumber(raw.czk));
  setText('rate',      raw.rate);
  setText('method',    methodOut);
  setText('acc',       accOut);
  setText('time',      timeOut);

  // Сбор полезной нагрузки (и для API, и для sendData)
  function buildPayload() {
    const userUnsafe = tg?.initDataUnsafe?.user || null;

    // На всякий случай подхватим сумму с экрана, если не сохранили
    const rubFromUI = (document.getElementById('rubAmount')?.textContent || '')
      .replace(/\s/g, '')
      .replace(',', '.');

    return {
      // Заявка
      flow:    raw.flow || 'account',
      method:  methodOut,
      rub:     String(localStorage.getItem('rub') || raw.rub || rubFromUI || '0'),
      czk:     String(localStorage.getItem('czk') || raw.czk || '0'),
      rate:    String(localStorage.getItem('rate') || raw.rate || '-'),
      account: accOut,
      name:    raw.name,
      comment: raw.comment,
      time:    timeOut,

      // Данные пользователя (из WebApp + лок. кэш)
      user: userUnsafe, // {id, username, first_name, last_name, language_code, ...}
      user_id:       String(localStorage.getItem('tg_user_id') || userUnsafe?.id || ''),
      user_username: localStorage.getItem('tg_username') || userUnsafe?.username || '',
      user_name: [
        localStorage.getItem('tg_first_name') || userUnsafe?.first_name || '',
        localStorage.getItem('tg_last_name')  || userUnsafe?.last_name  || ''
      ].filter(Boolean).join(' '),

      // Запасные варианты (URL/кэш)
      phone:     localStorage.getItem('user_phone') || qp.phone || '',
      url_uid:   qp.uid,
      url_uname: qp.uname,
      url_name:  qp.name,

      // initData из Telegram WebApp (на бэке обязательно проверить подпись!)
      initData: tg?.initData || localStorage.getItem('tg_initData') || ''
    };
  }

  async function sendOrderToApi(payload) {
    const res = await fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(()=> ({}));
    if (!res.ok || data.success === false) {
      throw new Error(data.error || `HTTP ${res.status}`);
    }
  }

  const btn = document.querySelector('.btn-yellow');
  btn?.addEventListener('click', async (e) => {
    e.preventDefault();
    if (!btn.disabled) btn.disabled = true;

    const payload = buildPayload();

    try {
      // 1) Просим право писать пользователю (если ещё не было)
      tg?.requestWriteAccess?.((granted) => {
        if (!granted) {
          // Фолбэк — открываем диалог с ботом, чтобы пользователь дал доступ
          // ЗАМЕНИ YourBot на юзернейм твоего бота:
          tg?.openTelegramLink?.('https://t.me/innnntro_bot?start=lead');
        }
      });

      // 2) Немедленно шлём сервисное сообщение боту — он получит Update с web_app_data,
      //    и там будет message.from.id (user_id), чтобы ты мог сразу написать пользователю.
      tg?.sendData?.(JSON.stringify({
        type: 'lead',
        ...payload
      }));

      // 3) (Опционально) отправляем на ваш сервер/в канал — как и раньше
      await sendOrderToApi(payload);

      // 4) Переходим к оплате или закрываем мини-апп
      // tg?.close?.();
      window.location.href = 'payment.html';

    } catch (err) {
      console.error('Ошибка отправки заявки:', err);
      if (tg?.showPopup) {
        tg.showPopup({ title: 'Ошибка', message: String(err), buttons: [{ type:'ok' }] });
      } else {
        alert('Не удалось отправить: ' + err);
      }
      btn.disabled = false;
    }
  });
});

