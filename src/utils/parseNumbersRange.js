export function parseRange(config) {
  const [start, end] = config.split('-').map(i => parseFloat(i));

  return end
    ? [...[...new Array(end - start)].map((_, i) => start + i), end]
    : [start];
}


export default (config) => {
  const items = config.split(';');

  return items.reduce((res, item) => [...res, ...parseRange(item)], []);
};
