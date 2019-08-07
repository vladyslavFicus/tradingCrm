export default base => ['REQUEST', 'SUCCESS', 'FAILURE']
  .reduce((action, type) => ({ ...action, [type]: `${base}-${type.toLowerCase()}` }), {});
