export default (name, data) => {
  const a = document.createElement('a');
  a.href = window.URL.createObjectURL(data);
  a.download = name;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
};
