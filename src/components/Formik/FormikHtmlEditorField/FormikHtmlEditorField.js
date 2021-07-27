import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import HtmlEditor from 'components/HtmlEditor';

class FormikHtmlEditorField extends PureComponent {
  static propTypes = {
    form: PropTypes.shape({
      setFieldValue: PropTypes.func.isRequired,
    }).isRequired,
    field: PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      onChange: PropTypes.func.isRequired,
    }).isRequired,
  };

  onChange = (value) => {
    const {
      form: {
        setFieldValue,
      },
      field: {
        name,
      },
    } = this.props;

    setFieldValue(name, value);
  };

  render() {
    const {
      field: {
        value,
      },
    } = this.props;

    return (
      <HtmlEditor
        value={value}
        onChange={this.onChange}
      />
    );
  }
}

export default FormikHtmlEditorField;
