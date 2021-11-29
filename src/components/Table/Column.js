import PropTypes from 'prop-types';

const Column = () => null;

Column.propTypes = {
  sortBy: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]), // Item key to make it column sortable by
  width: PropTypes.number, // Width of column in px
  header: PropTypes.string, // Column label
  render: PropTypes.func.isRequired, // Custom component to render column
};

Column.defaultProps = {
  sortBy: null,
  header: null,
  width: null,
};

export default Column;
