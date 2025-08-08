// api/send.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { rub, czk, rate, method, account, name, comment, time } = req.body;

  const token = '8086537306:AAGBWegYWFI0OxESqPHICyTrlrpnanoRPdg';
  const chat_id = '2736797226';

  const message = `💳 *Новая заявка*\n` +
    `*Отдаёт:* ${rub} RUB\n` +
    `*Получает:* ${czk} CZK\n` +
    `*Курс:* ${rate}\n` +
    `*Способ:* ${method}\n` +
    `*Счёт:* ${account}\n` +
    `*Имя:* ${name}\n` +
    `*Комментарий:* ${comment || '—'}\n` +
    `*Время:* ${time}`;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const payload = {
    chat_id,
    text: message,
    parse_mode: 'Markdown'
  };

  try {
    const telegramRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await telegramRes.json();

    if (!data.ok) {
      return res.status(500).json({ error: 'Telegram error', data });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}
