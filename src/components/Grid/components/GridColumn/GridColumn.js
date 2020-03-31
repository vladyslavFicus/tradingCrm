import { PureComponent } from 'react';
import PropTypes from 'prop-types';

/**
 *
 * The GridColumn component are needed:
 * 1) to build data object and use it in Grid component;
 * 2) To filter necessary data (child.type === GridColumn)
 *
 */
class GridColumn extends PureComponent {
  static propTypes = {
    header: PropTypes.string, // eslint-disable-line
    isHidden: PropTypes.bool, // eslint-disable-line
    render: PropTypes.oneOfType([PropTypes.func, PropTypes.string]), // eslint-disable-line
  };

  static defaultProps = {
    header: '',
    render: () => null,
    isHidden: false,
  };

  render() {
    return null;
  }
}

export default GridColumn;
