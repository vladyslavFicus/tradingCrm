import React, { PureComponent } from 'react';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import { Field } from 'formik';
import PropTypes from 'constants/propTypes';

class DynamicField extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
  };

  shouldFieldRender = () => {
    const {
      name,
      location: { state },
    } = this.props;

    // Get first part of field name
    const fieldName = name?.split('.')[0];

    return !!get(state?.filters, fieldName) || state?.filtersFields?.includes(fieldName);
  };

  render() {
    const {
      history,
      location,
      match,
      ...props
    } = this.props;

    return (
      <If condition={this.shouldFieldRender()}>
        <Field {...props} />
      </If>
    );
  }
}

export default withRouter(DynamicField);
