import { PureComponent } from 'react';
import PropTypes from '../../../../../constants/propTypes';

class SimpleFulfillment extends PureComponent {
  static propTypes = {
    onChangeUUID: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
  };

  componentDidMount() {
    const { onChangeUUID, type } = this.props;

    onChangeUUID(type);
  }

  render() {
    return null;
  }
}

export default SimpleFulfillment;
