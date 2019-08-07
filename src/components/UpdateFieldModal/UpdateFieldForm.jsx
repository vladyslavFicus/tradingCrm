import React, { Component } from 'react';
import { compose } from 'redux';
import { reduxForm, Field } from 'redux-form';
import { ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import { withNotifications } from '../HighOrder';
import { createValidator, translateLabels } from '../../utils/validator';
import PropTypes from '../../constants/propTypes';
import { TextAreaField } from '../ReduxForm';

class UpdateFieldForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    fieldName: PropTypes.string.isRequired,
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
    invalid: PropTypes.bool,
    fieldLabel: PropTypes.string.isRequired,
    actionText: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    reset: PropTypes.func.isRequired,
  };

  static defaultProps = {
    submitting: false,
    actionText: '',
    pristine: false,
    invalid: true,
  };

  componentDidUpdate({ isOpen }) {
    if (!this.props.isOpen && isOpen) {
      this.props.reset();
    }
  }

  handleSubmit = async (data) => {
    const { onCloseModal, onSubmit, notify, title } = this.props;
    const result = await onSubmit(data);
    const error = get(result, 'error');

    notify({
      level: error ? 'error' : 'success',
      title: I18n.t(title),
      message: `${error ? I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY') : I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
    });

    if (!error) {
      onCloseModal();
    }
  };

  render() {
    const {
      handleSubmit,
      onCloseModal,
      submitting,
      pristine,
      fieldName,
      invalid,
      title,
      fieldLabel,
      actionText,
    } = this.props;

    return (
      <form onSubmit={handleSubmit(this.handleSubmit)}>
        <ModalHeader toggle={onCloseModal}>{I18n.t(title)}</ModalHeader>
        <ModalBody>
          <div className="text-center font-weight-700">
            <div className="margin-bottom-10">{I18n.t(actionText)}</div>
          </div>
          <Field
            name={fieldName}
            label={I18n.t(fieldLabel)}
            component={TextAreaField}
          />
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            onClick={onCloseModal}
            className="btn btn-default-outline mr-auto"
          >
            {I18n.t('COMMON.CANCEL')}
          </button>
          <button
            disabled={submitting || pristine || invalid}
            type="submit"
            className="btn btn-primary"
          >
            {I18n.t('COMMON.SUBMIT')}
          </button>
        </ModalFooter>
      </form>
    );
  }
}

export default compose(
  reduxForm({
    enableReinitialize: true,
    validate: (_, { fieldRules, fieldName, fieldLabel }) => createValidator({
      [fieldName]: fieldRules,
    }, translateLabels({ [fieldName]: I18n.t(fieldLabel) }), false),
  }),
  withNotifications,
)(UpdateFieldForm);
