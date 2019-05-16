import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import { Field, reduxForm, getFormSyncErrors, getFormValues } from 'redux-form';
import { InputField } from 'components/ReduxForm';
import { createValidator } from 'utils/validator';

const FORM_NAME = 'updateSkypeProfile';
const attributeLabels = {
  skype: I18n.t('COMMON.SKYPE'),
};

class SkypeForm extends PureComponent {
  static propTypes = {
    dirty: PropTypes.bool,
    submitting: PropTypes.bool,
    valid: PropTypes.bool,
    disabled: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    dirty: false,
    submitting: false,
    valid: true,
    disabled: false,
  };

  render() {
    const {
      handleSubmit,
      dirty,
      submitting,
      valid,
      disabled,
      onSubmit,
    } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="text-right">
          <If condition={dirty && !submitting && valid && !disabled}>
            <button className="btn btn-sm btn-primary" type="submit">
              {I18n.t('COMMON.SAVE_CHANGES')}
            </button>
          </If>
        </div>
        <div className="form-row">
          <Field
            name="skype"
            label={attributeLabels.skype}
            type="text"
            component={InputField}
            disabled
            className="col-8"
          />
        </div>
      </form>
    );
  }
}

export default compose(
  connect(state => ({
    currentValues: getFormValues(FORM_NAME)(state),
    formSyncErrors: getFormSyncErrors(FORM_NAME)(state),
  })),
  reduxForm({
    form: FORM_NAME,
    validate: createValidator({
      email: 'required|email',
    }, attributeLabels, false),
    enableReinitialize: true,
  }),
)(SkypeForm);
