// /api/send.js — Vercel serverless function
function esc(s=''){ return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

export default async function handler(req, res){
  if (req.method !== 'POST'){
    return res.status(405).json({ success:false, error:'Method Not Allowed' });
  }
  try {
    const {
      flow='account',
      method = flow === 'cash' ? 'Наличные' : 'На счёт',
      rub='0', czk='0', rate='-',
      account = flow === 'cash' ? '-' : '-',
      name='-', comment='-',
      time = flow === 'cash' ? '—' : 'До 24 часов',

      // из WebApp (если доступно)
      user_id='', user_username='', user_name='',

      // из URL / локального кэша (бот передал при открытии мини-аппа)
      phone='', url_uid='', url_uname='', url_name=''
    } = req.body || {};

    const token  = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId){
      return res.status(500).json({ success:false, error:'Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID' });
    }

    // финальные данные пользователя: приоритет WebApp, потом URL
    const finalId   = String(user_id || url_uid || '');
    const finalUser = (user_username || url_uname || '').replace(/^@/, '');
    const finalName = user_name || url_name || '';
    const phoneOut  = phone || 'не указан';

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

    const tgResp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ chat_id: chatId, text, parse_mode:'HTML', disable_web_page_preview:true })
    });
    const tgJson = await tgResp.json();
    if (!tgJson.ok){
      return res.status(502).json({ success:false, error: tgJson.description || 'Telegram error' });
    }
    return res.status(200).json({ success:true });
  } catch (e){
    console.error('[api/send] error', e);
    return res.status(500).json({ success:false, error:'Internal Server Error' });
  }
}






