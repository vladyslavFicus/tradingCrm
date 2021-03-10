import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'constants/propTypes';
import RichTextEditor from 'react-rte';
import cn from 'classnames';
import { toolbarConfig as defaultToolbarConfig } from './toolbarConfig';
import './FormikTextEditor.scss';

class FormikTextEditorField extends PureComponent {
  static propTypes = {
    toolbarConfig: PropTypes.shape({
      INLINE_STYLE_BUTTONS: PropTypes.arrayOf(PropTypes.object),
      BLOCK_TYPE_DROPDOWN: PropTypes.arrayOf(PropTypes.object),
      BLOCK_TYPE_BUTTONS: PropTypes.arrayOf(PropTypes.object),
      display: PropTypes.arrayOf(PropTypes.string),
    }),
    placeholder: PropTypes.string,
    className: PropTypes.string,
    value: PropTypes.string,
    field: PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.object,
      ]),
    }).isRequired,
    form: PropTypes.shape({
      errors: PropTypes.object.isRequired,
      touched: PropTypes.object.isRequired,
      setFieldValue: PropTypes.func.isRequired,
    }).isRequired,
    label: PropTypes.string,
  };

  static defaultProps = {
    className: null,
    placeholder: '',
    toolbarConfig: defaultToolbarConfig,
    value: '',
    label: '',
  };

  state = {
    markup: this.props.field.value
      ? RichTextEditor.createValueFromString(this.props.field.value, 'html')
      : RichTextEditor.createEmptyValue(),
  };

  static getDerivedStateFromProps({ field: { value } }, { markup: { _cache } }) {
    if (value && !_cache.html) {
      return {
        markup: RichTextEditor.createValueFromString(value, 'html'),
      };
    }

    return null;
  }

  onChange = (markup) => {
    const {
      field: { name },
      form: { setFieldValue },
    } = this.props;

    this.setState({ markup });

    setFieldValue(name, markup.toString('html'));
  };

  render() {
    const {
      props: {
        toolbarConfig,
        placeholder,
        className,
        label,
        form: { errors },
        field: { name },
      },
      state: { markup },
      onChange,
    } = this;

    return (
      <Fragment>
        <If condition={label}>
          <label className="FormikTextEditorField__label">{label}</label>
        </If>
        <RichTextEditor
          toolbarConfig={toolbarConfig}
          value={markup}
          onChange={onChange}
          className={
            cn(`FormikTextEditorField__rich-text-editor ${className}`,
              { 'FormikTextEditorField__rich-text-editor--error': errors[name] })
          }
          placeholder={placeholder}
        />
        <If condition={errors[name]}>
          <div className="FormikTextEditorField__error-wrapper">
            <i className="FormikTextEditorField__error-icon icon-alert" />
            {errors[name]}
          </div>
        </If>
      </Fragment>
    );
  }
}

export default FormikTextEditorField;
