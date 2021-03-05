import React, { PureComponent } from 'react';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import PropTypes from 'constants/propTypes';
import RangeGroup from '../RangeGroup';

class DynamicRangeGroup extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    ...RangeGroup.propTypes,
    name: PropTypes.string.isRequired,
  };

  shouldFieldRender = () => {
    const {
      name,
      location: { state },
    } = this.props;

    return !!get(state?.filters, name) || state?.filtersFields?.includes(name);
  };

  render() {
    const {
      history,
      location,
      match,
      name,
      ...props
    } = this.props;

    return (
      <If condition={this.shouldFieldRender()}>
        <RangeGroup {...props} />
      </If>
    );
  }
}

export default withRouter(DynamicRangeGroup);
