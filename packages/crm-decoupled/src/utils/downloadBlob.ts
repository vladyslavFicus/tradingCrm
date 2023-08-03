export default (name: string, data: Blob) => {
  if (window && window.URL) {
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(data);
    a.download = name;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(a.href);
  }
};
