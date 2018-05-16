export default (e, callback) => {
  e.stopPropagation();

  return callback(e);
};
