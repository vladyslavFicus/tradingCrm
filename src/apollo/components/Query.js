import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

class CustomQuery extends PureComponent {
  static propTypes = {
    pollInterval: PropTypes.number,
  };

  static defaultProps = {
    pollInterval: 0,
  };

  state = {
    pollActive: true,
  };

  componentDidMount() {
    document.addEventListener('visibilitychange', this.pollControl, false);
  }

  componentWillUnmount() {
    document.removeEventListener('visibilitychange', this.pollControl, false);
  }

  pollControl = () => this.setState({
    pollActive: document.visibilityState === 'visible',
  });

  render() {
    const { pollInterval, ...props } = this.props;
    const { pollActive } = this.state;

    return (
      <Query {...props} pollInterval={pollActive ? pollInterval : 0} />
    );
  }
}

export default CustomQuery;
