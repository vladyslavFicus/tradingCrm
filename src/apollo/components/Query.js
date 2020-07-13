import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query as OriginalQuery } from 'react-apollo';

/*
  This is custom Query component which goal is
  to make polling control in dependance of active browser tab state
*/
class Query extends PureComponent {
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
      <OriginalQuery {...props} pollInterval={pollActive ? pollInterval : 0} />
    );
  }
}

export default Query;
