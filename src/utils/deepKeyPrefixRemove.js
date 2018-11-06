const isObject = data => typeof data === 'object' && data !== null;

const deepRemoveKeyByRegex = (item, keyPrefix) => {
  let nextItem = item;

  if (isObject(item)) {
    if (!Array.isArray(nextItem)) {
      nextItem = { ...nextItem };

      Object.keys(nextItem).forEach((name) => {
        if (name.match(keyPrefix)) {
          delete nextItem[name];
        } else {
          nextItem[name] = deepRemoveKeyByRegex(nextItem[name], keyPrefix);
        }
      });
    } else {
      nextItem = nextItem.map(i => deepRemoveKeyByRegex(i, keyPrefix));
    }
  }

  return nextItem;
};

export default deepRemoveKeyByRegex;
