export default (name: string, url: string) => {
  if (window && window.URL) {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(link.href);
    link.remove();
  }
};
