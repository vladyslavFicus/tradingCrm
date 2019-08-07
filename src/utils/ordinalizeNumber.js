export default (n, locale = 'en') => {
  if (locale === 'ru') {
    const s = ['ый', 'ой', 'ий'];

    if (n === 2 || n === 6 || n === 7 || n === 8) {
      return `${n}${s[1]}`;
    } if (n === 3) {
      return `${n}${s[2]}`;
    }

    return `${n}${s[0]}`;
  } if (locale === 'en') {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;

    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  return n;
};
