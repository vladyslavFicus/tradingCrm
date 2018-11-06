import PropTypes from 'prop-types';
import { SIZES, TYPES } from './constants';

const FilterItem = ({ children }) => children;
FilterItem.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  size: PropTypes.oneOf(Object.values(SIZES)).isRequired,
  type: PropTypes.oneOf(Object.values(TYPES)).isRequired,
  default: PropTypes.bool,
  children: PropTypes.any.isRequired,
};
FilterItem.defaultProps = {
  default: false,
  placeholder: null,
};

export default FilterItem;
