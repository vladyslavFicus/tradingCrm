import { PropTypes } from 'react';

PropTypes.price = PropTypes.shape({
  amount: PropTypes.number,
  currency: PropTypes.string,
});

export default PropTypes;
