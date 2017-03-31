import { PropTypes } from 'react';

PropTypes.price = PropTypes.shape({
  amount: PropTypes.number,
  currency: PropTypes.string,
});
PropTypes.navItem = PropTypes.shape({
  icon: PropTypes.string,
  label: PropTypes.string.isRequired,
  url: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.navItem),
});

export default PropTypes;
