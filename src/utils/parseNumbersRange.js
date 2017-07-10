export default (config) => {
  const items = config.split(';');
  return items.reduce((res, item) => {
    const [start, end] = item.split('-').map(i => parseInt(i, 10));

    return end
      ? [...res, ...[...new Array(end - (start + 1))].map((_, i) => start + i)]
      : [...res, start];
  }, []);
};
