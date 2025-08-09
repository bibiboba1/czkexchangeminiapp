console.log('LAST SCRIPT LOADED');

// Формат числа
function formatNumber(n) {
  const num = Number(n);
  return Number.isFinite(num) ? num.toLocaleString('ru-RU') : '0';
}

// Безопасная подстановка текста
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? '';
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('[last] DOMContentLoaded');

  if (!document.getElementById('lastPage')) return;

  const raw = {
    flow:   localStorage.getItem('flow'),         // 'account' | 'cash'
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
  const timeOut   = isCash ? (raw.time || '—') : (raw.time || 'до 1 часа');

  // Подставляем значения
  setText('rubAmount', formatNumber(raw.rub));
  setText('czkAmount', formatNumber(raw.czk));
  setText('rate',      raw.rate);
  setText('method',    methodOut);
  setText('acc',       accOut);
  setText('time',      timeOut);

  console.log('[last] applied', { ...raw, methodOut, accOut, timeOut });

  // Кнопка "Создать заявку"
  document.querySelector('.btn-yellow')?.addEventListener('click', async () => {
    alert('Заявка отправлена!');
    // Здесь твой код отправки данных на сервер, если нужен
  });
});


  
