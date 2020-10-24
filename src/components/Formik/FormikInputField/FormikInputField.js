import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { get, omit } from 'lodash';
import Input from 'components/Input';

class FormikInputField extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    field: PropTypes.shape({
      name: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    form: PropTypes.shape({
      errors: PropTypes.object.isRequired,
    }).isRequired,
    type: PropTypes.string,
    withFocus: PropTypes.bool,
  };

  static defaultProps = {
    type: 'text',
    withFocus: false,
  };

  render() {
    const {
      location,
      field: {
        name,
        value,
        onChange,
      },
      form: {
        errors,
      },
      withFocus,
      ...input
    } = this.props;

    const isFocused = withFocus
      ? Boolean(get(location, `state.filters.${name}`) || get(location, `query.filters.${name}`))
      : false;

    return (
      <Input
        name={name}
        value={value !== null ? value : ''}
        onChange={onChange}
        error={get(errors, name)}
        isFocused={isFocused}
        {...omit(input, ['staticContext'])}
      />
    );
  }
}

export default withRouter(FormikInputField);
