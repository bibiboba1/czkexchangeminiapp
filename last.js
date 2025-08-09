console.log('LAST SCRIPT LOADED');

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

// Функция для получения значения из localStorage с дефолтом
function getLS(key, fallback = '-') {
  const v = localStorage.getItem(key);
  return (v === null || v === '') ? fallback : v;
}

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('confirmPage')) return;

  const raw = {
    flow:   localStorage.getItem('flow'),
    rub:    localStorage.getItem('rub') || 0,
    czk:    localStorage.getItem('czk') || 0,
    rate:   localStorage.getItem('rate') || '',
    acc:    localStorage.getItem('account') || '',
    method: localStorage.getItem('method'),
    time:   localStorage.getItem('time')
  };

  if (!raw.flow && !raw.method) {
    console.warn('[last] no flow/method — redirect to index');
    window.location.replace('index.html');
    return;
  }

  const isCash = raw.flow === 'cash' || raw.method === 'Наличные';
  const methodOut = isCash ? 'Наличные' : (raw.method || 'На счёт');
  const accOut    = isCash ? '-'        : raw.acc;
  const timeOut   = isCash ? (raw.time || '—') : (raw.time || 'до 24 часов');

  setText('rubAmount', formatNumber(raw.rub));
  setText('czkAmount', formatNumber(raw.czk));
  setText('rate',      raw.rate);
  setText('method',    methodOut);
  setText('acc',       accOut);
  setText('time',      timeOut);

  // === Обработчик кнопки ===
  document.querySelector('.btn-yellow')?.addEventListener('click', async () => {
    // Получаем данные пользователя из Telegram Mini App
    let tgUser = {
      id: 'неизвестно',
      username: 'нет',
      name: 'нет'
    };

    if (window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe) {
      const u = Telegram.WebApp.initDataUnsafe.user;
      if (u) {
        tgUser.id = u.id || 'неизвестно';
        tgUser.username = u.username || 'нет';
        tgUser.name = (u.first_name || '') + (u.last_name ? ' ' + u.last_name : '');
      }
    }

    const payload = {
      flow: getLS('flow', 'account'),
      method: methodOut,
      rub: getLS('rub', '0'),
      czk: getLS('czk', '0'),
      rate: getLS('rate', '-'),
      account: accOut,
      name: getLS('name', '-'),
      comment: getLS('comment', '-'),
      time: timeOut,
      user_id: tgUser.id,
      user_username: tgUser.username,
      user_name: tgUser.name
    };

    console.log('Отправка заявки...', payload);

    const btn = document.querySelector('.btn-yellow');
    const originalText = btn.textContent;
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

      window.location.href = 'success.html';
    } catch (e) {
      alert('Ошибка отправки: ' + e.message);
      console.error('[send] error:', e);
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });
});






  
