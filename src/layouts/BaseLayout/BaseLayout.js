import PropTypes from 'prop-types';
import './BaseLayout.scss';

const BaseLayout = ({ children }) => children;

BaseLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default BaseLayout;
