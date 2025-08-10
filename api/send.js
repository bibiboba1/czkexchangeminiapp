// /api/send.js — Vercel serverless function
import crypto from 'crypto';

function esc(s = '') {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

// --- Проверка и парсинг initData от Telegram ---
function verifyInitData(initData, botToken) {

  const params = new URLSearchParams(initData);
  const receivedHash = params.get('hash');
  if (!receivedHash) throw new Error('no hash in initData');

  params.delete('hash');

  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const secret = crypto.createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();

  const calcHash = crypto.createHmac('sha256', secret)
    .update(dataCheckString)
    .digest('hex');

  if (calcHash !== receivedHash) throw new Error('Bad initData hash');

  const out = {};
  for (const [k, v] of params.entries()) {
    if (k === 'user') {
      try { out.user = JSON.parse(v); } catch { out.user = null; }
    } else {
      out[k] = v;
    }
  }
  return out; // вернёт { user, auth_date, query_id, ... }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
  try {
    const {
      flow = 'account',
      method = flow === 'cash' ? 'Наличные' : 'На счёт',
      rub = '0', czk = '0', rate = '-',
      account = flow === 'cash' ? '-' : '-',
      name = '-', comment = '-',
      time = flow === 'cash' ? '—' : 'До 24 часов',

      // из WebApp (если доступно)
      user_id = '', user_username = '', user_name = '',

      // из URL / локального кэша
      phone = '', url_uid = '', url_uname = '', url_name = '',

      // initData из Telegram WebApp
      initData = ''
    } = req.body || {};

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
      return res.status(500).json({ success: false, error: 'Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID' });
    }

    // --- 1) Пытаемся достать реального пользователя из initData ---
    let tmaUser = null;
if (initData) {
  try {
    const verified = verifyInitData(initData, token);
    tmaUser = verified.user || null;
  } catch (err) {
    console.warn('[send] initData verify failed:', err.message);
  }
}


    // --- 2) Формируем итоговые данные пользователя ---
    const finalId = String(tmaUser?.id || user_id || url_uid || '') || 'неизвестно';
    const finalUser = (tmaUser?.username || user_username || url_uname || '').replace(/^@/, '');
    const finalName = tmaUser
      ? [tmaUser.first_name, tmaUser.last_name].filter(Boolean).join(' ')
      : (user_name || url_name || '');
    const phoneOut = phone || 'не указан';

    const usernameLine = finalUser
      ? `username: <a href="https://t.me/${esc(finalUser)}">@${esc(finalUser)}</a>`
      : `username: <i>нет</i>`;

    const text =
      `<b>Заявка</b>\n` +
      `Способ: <b>${esc(method)}</b>\n` +
      `Сумма RUB: <b>${esc(rub)}</b>\n` +
      `Сумма CZK: <b>${esc(czk)}</b>\n` +
      `Курс: <b>${esc(rate)}</b>\n` +
      `Счёт: <b>${esc(account)}</b>\n` +
      `Имя (форма): <b>${esc(name)}</b>\n` +
      `Комментарий: <b>${esc(comment)}</b>\n` +
      `Время: <b>${esc(time)}</b>\n` +
      `—\n` +
      `<i>Пользователь:</i>\n` +
      (finalId ? `id: <code>${esc(finalId)}</code>\n` : `id: <i>неизвестно</i>\n`) +
      `${usernameLine}\n` +
      `name: <b>${esc(finalName || 'нет')}</b>\n` +
      `phone: <b>${esc(phoneOut)}</b>`;

    // --- 3) Отправка в Telegram канал ---
    const tgResp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });
    const tgJson = await tgResp.json();
    if (!tgJson.ok) {
      return res.status(502).json({ success: false, error: tgJson.description || 'Telegram error' });
    }
    return res.status(200).json({ success: true });
  } catch (e) {
    console.error('[api/send] error', e);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}







