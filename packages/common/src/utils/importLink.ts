/**
 * Import file like as a link
 *
 * @param options
 */
const importLink = (options: Record<string, string>) => new Promise((resolve, reject) => {
  const sheet = document.createElement('link');

  Object.assign(sheet, options, {
    onload: resolve,
    onerror: reject,
  });

  document.head.appendChild(sheet);
});

export default importLink;
