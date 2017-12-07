import PropTypes from 'prop-types';

const FilterField = ({ children }) => children;
FilterField.propTypes = {
  name: PropTypes.string.isRequired,
};

export default FilterField;
