import PropTypes from 'prop-types';

const FilterField = ({ children }) => children;
FilterField.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  normalize: PropTypes.func,
};

export default FilterField;
