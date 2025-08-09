// /api/send.js — Vercel serverless function

function esc(s = '') {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const {
      flow = 'account',
      method = flow === 'cash' ? 'Наличные' : 'На счёт',
      rub = '0',
      czk = '0',
      rate = '-',
      account = flow === 'cash' ? '-' : '-',
      name = '-',
      comment = '-',
      time = flow === 'cash' ? '—' : 'До 24 часов',
      user = {}
    } = req.body || {};

    const userId    = user?.id ? String(user.id) : '';
    const username  = user?.username ? `@${user.username}` : '';
    const fullName  = [user?.first_name, user?.last_name].filter(Boolean).join(' ');

    // Собираем текст для канала
    const lines = [
      `<b>Заявка</b>`,
      `Способ: <b>${esc(method)}</b>`,
      `Сумма RUB: <b>${esc(rub)}</b>`,
      `Сумма CZK: <b>${esc(czk)}</b>`,
      `Курс: <b>${esc(rate)}</b>`,
      `Счёт: <b>${esc(account)}</b>`,
      `Имя (формы): <b>${esc(name)}</b>`,
      `Комментарий: <b>${esc(comment)}</b>`,
      `Время: <b>${esc(time)}</b>`,
      `—`,
      `<i>Пользователь Mini App:</i>`,
      userId    ? `id: <code>${esc(userId)}</code>` : `id: <i>неизвестно</i>`,
      username  ? `username: <b>${esc(username)}</b>` : `username: <i>нет</i>`,
      fullName  ? `name: <b>${esc(fullName)}</b>` : `name: <i>нет</i>`
    ];

    const text = lines.join('\n');

    const token  = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
      return res.status(500).json({
        success: false,
        error: 'Server not configured: missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID'
      });
    }

    const tgResp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    const tgJson = await tgResp.json();
    if (!tgResp.ok || !tgJson.ok) {
      const errMsg = tgJson?.description || `Telegram error: ${tgResp.status}`;
      return res.status(502).json({ success: false, error: errMsg });
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error('[api/send] error:', e);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}



