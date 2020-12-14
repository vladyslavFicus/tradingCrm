import PropTypes from 'prop-types';

const Column = () => null;

Column.propTypes = {
  maxWidth: PropTypes.number, // eslint-disable-line
  header: PropTypes.string, // eslint-disable-line
  render: PropTypes.func.isRequired, // eslint-disable-line
};

Column.defaultProps = {
  header: null,
  maxWidth: null,
};

export default Column;
