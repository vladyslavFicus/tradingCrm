export default (key, value) => (key === '__typename' ? undefined : value);
