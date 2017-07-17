import PropTypes from 'prop-types';

PropTypes.brand = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
});
PropTypes.department = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  role: PropTypes.string,
  image: PropTypes.string.isRequired,
});

export default PropTypes;
