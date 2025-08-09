// /api/send.js — Vercel serverless function (Node 18+)

// Безопасное экранирование под HTML parse_mode
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
      flow = 'account',           // 'account' | 'cash'
      method = flow === 'cash' ? 'Наличные' : 'На счёт',
      rub = '0',
      czk = '0',
      rate = '-',
      account = flow === 'cash' ? '-' : '-',
      name = '-',
      comment = '-',
      time = flow === 'cash' ? '—' : 'до 1 часа',
    } = req.body || {};

    // Собираем текст для Telegram (HTML-разметка)
    const text =
      `<b>Заявка</b>\n` +
      `Способ: <b>${esc(method)}</b>\n` +
      `Сумма RUB: <b>${esc(rub)}</b>\n` +
      `Сумма CZK: <b>${esc(czk)}</b>\n` +
      `Курс: <b>${esc(rate)}</b>\n` +
      `Счёт: <b>${esc(account)}</b>\n` +
      `Имя: <b>${esc(name)}</b>\n` +
      `Комментарий: <b>${esc(comment)}</b>\n` +
      `Время: <b>${esc(time)}</b>`;

    const token = process.env.8086537306:AAGBWegYWFI0OxESqPHICyTrlrpnanoRPdg;
    const chatId = process.env.2736797226;

    if (!token || !chatId) {
      return res.status(500).json({
        success: false,
        error: 'Server not configured: missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID'
      });
    }

    // Отправка в Telegram
    const tgResp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
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


