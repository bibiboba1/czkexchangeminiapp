document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('rubAmount').textContent = localStorage.getItem('rub') || '';
  document.getElementById('czkAmount').textContent = localStorage.getItem('czk') || '';
  document.getElementById('rate').textContent = localStorage.getItem('rate') || '';
  document.getElementById('method').textContent = localStorage.getItem('method') || '';
  document.getElementById('acc').textContent = localStorage.getItem('account') || '';
  document.getElementById('username').textContent = localStorage.getItem('name') || '';
  document.getElementById('commentText').textContent = localStorage.getItem('comment') || '';
  document.getElementById('time').textContent = localStorage.getItem('time') || '';
});
