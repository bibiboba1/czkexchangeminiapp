document.addEventListener('DOMContentLoaded', () => {
  const b64u = s => btoa(unescape(encodeURIComponent(s)))
    .replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');

  document.getElementById('openChatBtn')?.addEventListener('click', () => {
    const flow = localStorage.getItem('flow') || '-';
    const data = {
      flow,
      rub:  localStorage.getItem('rub')  || '-',
      czk:  localStorage.getItem('czk')  || '-',
      rate: localStorage.getItem('rate') || '-',
      account: localStorage.getItem('account') || '-',
      name:    localStorage.getItem('name')    || '-',
      comment: localStorage.getItem('comment') || '-',
      time:    localStorage.getItem('time')    || '-',
    };
    // компактная строка
    const compact = JSON.stringify(data);
    const payload = b64u(compact); // base64url
    window.open(`https://t.me/big_whipper?start=${payload}`, '_blank');
  });
});









