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
  const methodOut = isCash ? 'Наличные'       : (raw.method || 'На счёт');
  const accOut    = isCash ? '-'              : raw.acc;
  const timeOut   = isCash ? (raw.time || '—'): (raw.time || 'до 1 часа');

  console.log('[last]', { ...raw, isCash, methodOut, accOut, timeOut });

  setText('rubAmount', formatNumber(raw.rub));
  setText('czkAmount', formatNumber(raw.czk));
  setText('rate',      raw.rate);
  setText('method',    methodOut);
  setText('acc',       accOut);
  setText('time',      timeOut);

  document.querySelector('.btn-yellow')?.addEventListener('click', () => {
    console.log('Отправка заявки...', { ...raw, methodOut, accOut, timeOut });
    window.location.href = 'success.html';
  });
  
});



  
