export default (config) => {
  const items = config.split(';');

  return items.reduce((res, item) => {
    const [start, end] = item.split('-').map(i => parseFloat(i));

    return end
      ? [...res, ...[...new Array(end - start)].map((_, i) => start + i), end]
      : [...res, start];
  }, []);
};
