document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('goBack')?.addEventListener('click', () => {
    window.location.href = 'Second.html';
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('input')) {
    document.activeElement.blur();
  }
});
