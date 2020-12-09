import PropTypes from 'prop-types';

const Column = () => null;

Column.propTypes = {
  header: PropTypes.string, // eslint-disable-line
  render: PropTypes.func.isRequired, // eslint-disable-line
};

Column.defaultProps = {
  header: null,
};

export default Column;
