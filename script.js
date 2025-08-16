// === Telegram Mini App init + сохранение пользователя ===
document.addEventListener('DOMContentLoaded', () => {
  const tg = window.Telegram?.WebApp;

  try {
    tg?.ready();
    tg?.expand?.();
  } catch (e) {
    console.warn('Telegram WebApp not available:', e);
  }

  // Сохраняем initData всегда, если оно есть
  if (tg?.initData) {
    try {
      localStorage.setItem('tg_initData', tg.initData);
    } catch (e) {
      console.warn('Failed to store initData:', e);
    }
  }

  // Если есть профиль пользователя — кешируем удобные поля
  const u = tg?.initDataUnsafe?.user || null;
  if (u) {
    try {
      localStorage.setItem('tg_user_id', String(u.id || ''));
      localStorage.setItem('tg_username', u.username || '');
      localStorage.setItem('tg_first_name', u.first_name || '');
      localStorage.setItem('tg_last_name', u.last_name || '');
    } catch (e) {
      console.warn('Failed to store Telegram user:', e);
    }
  }

  // Телефон/имя из URL — в кэш
  const p = new URLSearchParams(location.search);
  const phone = (p.get('phone') || '').trim();
  const name  = (p.get('name')  || '').trim();
  if (phone) localStorage.setItem('user_phone', phone);
  if (name)  localStorage.setItem('name', name);
});


// === элементы ===
const input = document.getElementById('inputAmount');
const output = document.getElementById('outputAmount');
const exchangeBtn = document.getElementById('exchangeBtn');

// === КУРСЫ ===
function getRate(rub) {
  const czk = rub / 4.1;
  return czk >= 20000 ? 4.05 : 4.1;
}

// Формат числа: "20 000"
function formatNumber(n) {
  return Math.round(n).toLocaleString('ru-RU');
}

// Обработка ввода
input?.addEventListener('input', () => {
  input.value = input.value.replace(/\D/g, '').slice(0, 7);

  const rub = parseFloat(input.value);
  if (!isNaN(rub)) {
    const rate = getRate(rub);
    const czk = rub / rate;

    localStorage.setItem('rub', String(Math.round(rub)));
    localStorage.setItem('czk', String(Math.round(czk)));
    localStorage.setItem('rate', String(rate));

    output.value = formatNumber(czk); // показываем CZK без копеек и с пробелами
  } else {
    output.value = '';
    localStorage.removeItem('rub');
    localStorage.removeItem('czk');
    localStorage.removeItem('rate');
  }
});

// Убираем клавиатуру при клике вне input
document.addEventListener('click', (e) => {
  if (!e.target.closest('input')) {
    document.activeElement.blur();
  }
});

// Переход на следующую страницу
exchangeBtn?.addEventListener('click', () => {
  // подстраховка: если суммы ещё не в LS, посчитаем на лету
  const rub = Number(localStorage.getItem('rub') || input?.value || 0);
  if (rub > 0 && !localStorage.getItem('rate')) {
    const rate = getRate(rub);
    const czk = rub / rate;
    localStorage.setItem('rub', String(Math.round(rub)));
    localStorage.setItem('czk', String(Math.round(czk)));
    localStorage.setItem('rate', String(rate));
  }

  // Если Telegram Mini App есть — проверим, что initData уже сохранён
  const hasInit = !!localStorage.getItem('tg_initData');
  if (!hasInit) {
    // не критично: продолжаем, но можно предупредить пользователя
    const tg = window.Telegram?.WebApp;
    if (tg?.showPopup) {
      tg.showPopup({
        title: 'Внимание',
        message: 'Мы не получили данные Telegram (initData). Если вы открыли страницу не из бота, ID/username могут быть недоступны.',
        buttons: [{ type: 'ok' }]
      });
    }
  }

  window.location.href = 'second.html';
});




  







