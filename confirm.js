// confirm.js — единая страница подтверждения

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

  // Базовые данные из хранилища
  const raw = {
    flow:   localStorage.getItem('flow'),         // 'account' | 'cash' | null
    rub:    localStorage.getItem('rub') || 0,
    czk:    localStorage.getItem('czk') || 0,
    rate:   localStorage.getItem('rate') || '',
    acc:    localStorage.getItem('account') || '',
    name:   localStorage.getItem('name') || '',
    comm:   localStorage.getItem('comment') || '',
    method: localStorage.getItem('method'),       // 'На счёт' | 'Наличные' | null
    time:   localStorage.getItem('time')          // 'ДД.ММ.ГГГГ ЧЧ:ММ - ЧЧ:ММ'
  };

  // Если пришли на confirm.html “напрямую” без выбора — отправим на старт
  if (!raw.flow && !raw.method) {
    console.warn('[confirm] no flow/method — redirect to index');
    window.location.replace('index.html');
    return;
  }

  // Надёжное определение ветки:
  // 1) верим flow, 2) если flow нет — смотрим на method
  const isCash = raw.flow === 'cash' || raw.method === 'Наличные';

  // Рассчитываем выводимые поля
  const methodOut = isCash ? 'Наличные' : (raw.method || 'На счёт');
  const accOut    = isCash ? '-'        : raw.acc;
  const timeOut   = isCash ? (raw.time || '—') : (raw.time || 'до 1 часа');

  // Логи для быстрой диагностики
  console.log('[confirm]', { ...raw, isCash, methodOut, accOut, timeOut });

  // Подстановка
  setText('rubAmount', formatNumber(raw.rub));
  setText('czkAmount', formatNumber(raw.czk));
  setText('rate',      raw.rate);
  setText('method',    methodOut);
  setText('acc',       accOut);
  setText('time',      timeOut);
  setText('username',  raw.name);     // если этих id нет — просто пропустится
  setText('commentText', raw.comm);

  // Кнопка отправки — твоя логика здесь
  document.querySelector('.btn-yellow')?.addEventListener('click', async () => {
    // …/api/send…
  });
});



