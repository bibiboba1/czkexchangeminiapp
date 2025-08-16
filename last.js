console.log('LAST SCRIPT LOADED v13');

// ── утилиты ───────────────────────────────────────────────────────────────────
function formatNumber(n) {
  const num = Number(n);
  return Number.isFinite(num) ? num.toLocaleString('ru-RU') : '0';
}
function setText(id, v) {
  const el = document.getElementById(id);
  if (el) el.textContent = v ?? '';
}
function getParams() {
  const p = new URLSearchParams(location.search);
  return {
    uid:   (p.get('uid') || '').trim(),
    uname: (p.get('uname') || '').trim(),
    name:  (p.get('name') || '').trim(),
    phone: (p.get('phone') || '').trim()
  };
}

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('confirmPage')) return;

  // Telegram WebApp SDK
  const tg = window.Telegram?.WebApp;
  try { tg?.ready(); tg?.expand?.(); } catch (e) {}

  // Параметры из URL
  const qp = getParams();
  if (qp.phone) localStorage.setItem('user_phone', qp.phone);

  // Данные из localStorage
  const raw = {
    flow:    localStorage.getItem('flow'),
    rub:     localStorage.getItem('rub') || 0,
    czk
