import PropTypes from 'prop-types';

const CountItems = ({ items, prefixOptions, mapFunction, joinString }) => {
  if (!items || !Array.isArray(items) || items.length === 0 || !prefixOptions) {
    return null;
  }

  return Object
    .keys(prefixOptions).reduce((res, prefix) => {
      const regex = new RegExp(`^${prefix}`);
      const count = items.reduce((count, item) => (item.match(regex) ? count + 1 : count), 0);

      return count === 0 ? res : [...res, { name: prefixOptions[prefix], count }];
    }, [])
    .map(mapFunction || (i => `${i.count} x ${i.name}`))
    .join(joinString);
};
CountItems.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  prefixOptions: PropTypes.objectOf(PropTypes.string).isRequired,
  mapFunction: PropTypes.func,
  joinString: PropTypes.string,
};
CountItems.defaultProps = {
  mapFunction: null,
  joinString: ', ',
};

export default CountItems;
