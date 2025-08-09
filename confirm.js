// confirm.js — единая страница подтверждения для веток "На счёт" и "Наличные"

function formatNumber(n) {
  const num = Number(n);
  return Number.isFinite(num) ? num.toLocaleString('ru-RU') : '0';
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? '';
}

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('confirmPage')) return;

  const flow         = localStorage.getItem('flow') || 'account'; // 'account' | 'cash'
  const rub          = localStorage.getItem('rub') || 0;
  const czk          = localStorage.getItem('czk') || 0;
  const rate         = localStorage.getItem('rate') || '';
  const account      = localStorage.getItem('account') || '';
  const name         = localStorage.getItem('name') || '';
  const comment      = localStorage.getItem('comment') || '';
  const storedMethod = localStorage.getItem('method');
  const storedTime   = localStorage.getItem('time');

  let methodOut, timeOut, accOut;

  if (flow === 'cash') {
    methodOut = 'Наличные';         // фиксируем "Наличные"
    accOut    = '-';                // счёта нет
    timeOut   = storedTime || '—';  // дата и время с cash-экрана
  } else {
    methodOut = storedMethod || 'На счёт';
    accOut    = account;
    timeOut   = storedTime || 'до 1 часа';
  }

  // Для быстрой отладки
  console.log('[confirm] flow=', flow, { methodOut, timeOut, accOut, storedTime });

  setText('rubAmount', formatNumber(rub));
  setText('czkAmount', formatNumber(czk));
  setText('rate',      rate);
  setText('method',    methodOut);
  setText('acc',       accOut);     // "Ваш номер счета"
  setText('time',      timeOut);    // "Ожидаемое время"
  setText('username',  name);       // если этих id нет в HTML — просто пропустится
  setText('commentText', comment);

  document.querySelector('.btn-yellow')?.addEventListener('click', async () => {
    // …твой код отправки /api/send…
  });
});


