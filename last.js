console.log('LAST SCRIPT LOADED v7');

// формат числа → "20 000"
function formatNumber(n) {
  const num = Number(n);
  return Number.isFinite(num) ? num.toLocaleString('ru-RU') : '0';
}
// безопасная подстановка текста
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? '';
}
// чтение из LS с дефолтом
function getLS(key, fallback = '-') {
  const v = localStorage.getItem(key);
  return (v === null || v === '') ? fallback : v;
}

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('confirmPage')) return;

  // --- Telegram Mini App user ---
const tg = window.Telegram?.WebApp;
try {
  tg?.ready();
  tg?.expand(); // разворачиваем веб-апп на всю высоту
} catch (e) {}

const initData = tg?.initData || '';              // подписанная строка от Telegram
const u = tg?.initDataUnsafe?.user || null;

console.log('[TG initDataUnsafe.user]', u);
if (!u) {
  console.warn('⚠️ Telegram user пуст. Скорее всего, мини-апп открыт не через кнопку web_app в чате бота.');
  // Можно один раз подсказать пользователю:
  // alert('Откройте приложение через кнопку в чате бота, чтобы мы увидели ваш Telegram ID');
}


  // для лога
  console.log('[TG user initDataUnsafe]', u);

  // --- заполнение экрана значениями ---
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

  const isCash   = raw.flow === 'cash' || raw.method === 'Наличные';
  const methodOut= isCash ? 'Наличные' : (raw.method || 'На счёт');
  const accOut   = isCash ? '-'        : raw.acc;
  const timeOut  = isCash ? (raw.time || '—') : (raw.time || 'До 24 часов');

  setText('rubAmount', formatNumber(raw.rub));
  setText('czkAmount', formatNumber(raw.czk));
  setText('rate',      raw.rate);
  setText('method',    methodOut);
  setText('acc',       accOut);
  setText('time',      timeOut);

  // --- отправка заявки ---
  const btn = document.querySelector('.btn-yellow');
  btn?.addEventListener('click', async () => {
    // собираем данные заявки
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

  // данные пользователя из Mini App
  user_id:       u?.id ?? 'неизвестно',
  user_username: u?.username ?? 'нет',
  user_name:     [u?.first_name, u?.last_name].filter(Boolean).join(' ') || 'нет',

  // для диагностики/валидации
  tg_init_data: initData,
  tg_platform: tg?.platform || ''
};


    console.log('[send payload]', payload);

    const t = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Отправляем...';

    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
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







  
