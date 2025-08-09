console.log('CONFIRM SCRIPT LOADED v3');
// confirm.js — единая страница подтверждения (без name/comment)

function formatNumber(n) {
  const num = Number(n);
  return Number.isFinite(num) ? num.toLocaleString('ru-RU') : '0';
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? '';
}

//document.addEventListener('DOMContentLoaded', () => {
 // if (!document.getElementById('confirmPage')) return;

  //// Читаем хранилище
 / const raw = {
  //  flow:   localStorage.getItem('flow'),         // 'account' | 'cash' | null
   // rub:    localStorage.getItem('rub') || 0,
 //   czk:    localStorage.getItem('czk') || 0,
  //  rate:   localStorage.getItem('rate') || '',
 //   acc:    localStorage.getItem('account') || '',
 //   method: localStorage.getItem('method'),       // 'На счёт' | 'Наличные' | null
 //   time:   localStorage.getItem('time')          // 'ДД.ММ.ГГГГ ЧЧ:ММ - ЧЧ:ММ'
 // };

  // Если зашли напрямую без выбора — вернём на старт
  if (!raw.flow && !raw.method) {
    console.warn('[confirm] no flow/method — redirect to index');
    window.location.replace('index.html');
    return;
  }

  // Надёжно определяем ветку: верим flow, иначе смотрим на method
  const isCash = raw.flow === 'cash' || raw.method === 'Наличные';

  // Вычисляем значения для вывода
  const methodOut = isCash ? 'Наличные'       : (raw.method || 'На счёт');
  const accOut    = isCash ? '-'              : raw.acc;
  const timeOut   = isCash ? (raw.time || '—'): (raw.time || 'до 1 часа');

  // Лейбл «Время» — принудительно меняем (вдруг HTML из кэша)
  const timeLabel = document.getElementById('time')?.previousElementSibling;
  if (timeLabel && timeLabel.classList.contains('cf-item-label')) {
    timeLabel.textContent = 'Время';
  }

  // Логи для быстрой диагностики
  console.log('[confirm]', { ...raw, isCash, methodOut, accOut, timeOut });

  // Подстановка значений на страницу
  setText('rubAmount', formatNumber(raw.rub));
  setText('czkAmount', formatNumber(raw.czk));
  setText('rate',      raw.rate);
  setText('method',    methodOut);
  setText('acc',       accOut);     // "Ваш номер счета"
  setText('time',      timeOut);    // "Время"

  // Делаем «последнее слово» за нами
requestAnimationFrame(() => {
  const flow   = localStorage.getItem('flow');
  const method = localStorage.getItem('method');
  const isCash = flow === 'cash' || method === 'Наличные';
  const accOut  = isCash ? '-' : (localStorage.getItem('account') || '');
  const timeOut = isCash ? (localStorage.getItem('time') || '—')
                         : (localStorage.getItem('time') || 'до 1 часа');

  const timeLabel = document.getElementById('time')?.previousElementSibling;
  if (timeLabel) timeLabel.textContent = 'Время';

  const accEl = document.getElementById('acc');
  const timeEl = document.getElementById('time');
  if (accEl)  accEl.textContent  = accOut;
  if (timeEl) timeEl.textContent = timeOut;
});


  // Кнопка отправки — твоя логика
  document.querySelector('.btn-yellow')?.addEventListener('click', async () => {
    // …/api/send…
  });
});



