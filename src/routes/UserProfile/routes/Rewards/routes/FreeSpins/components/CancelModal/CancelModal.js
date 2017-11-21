import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { getFormValues, Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../../constants/propTypes';
import renderLabel from '../../../../../../../../utils/renderLabel';
import { createValidator } from '../../../../../../../../utils/validator';
import { TextAreaField, SelectField } from '../../../../../../../../components/ReduxForm';
import Uuid from '../../../../../../../../components/Uuid';
import { actionLabels } from '../../../../../../../../constants/free-spin';
import { attributeLabels } from './constants';

const CUSTOM_REASON = 'custom';
const FORM_NAME = 'freeSpinCancelModal';

class CancelModal extends Component {
  static propTypes = {
    item: PropTypes.freeSpinEntity.isRequired,
    action: PropTypes.string,
    reasons: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    customReason: PropTypes.bool,
    currentValues: PropTypes.shape({
      reason: PropTypes.string,
      customReason: PropTypes.string,
    }).isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool.isRequired,
  };
  static defaultProps = {
    handleSubmit: null,
    action: null,
    reasons: {},
    customReason: true,
    currentValues: {
      reason: '',
      customReason: '',
    },
    pristine: false,
    submitting: false,
  };

  handleSubmit = ({ reason, customReason }) => {
    const { item, onSubmit } = this.props;

    return onSubmit({ uuid: item.uuid, reason: customReason || reason });
  };

  renderReasonsSelect = (reasons, customReason = false) => (
    <div className="form-group">
      <Field
        name="reason"
        label={I18n.t(attributeLabels.reason)}
        component={SelectField}
        position="vertical"
      >
        <option value="">{I18n.t('COMMON.SELECT_OPTION.REASON')}</option>
        {Object.keys(reasons).map(key => (
          <option key={key} value={key}>
            {renderLabel(key, reasons)}
          </option>
        ))}
        {
          customReason &&
          <option value="custom">
            {I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CANCEL.CUSTOM_REASON_OPTION')}
          </option>
        }
      </Field>
    </div>
  );

  render() {
    const {
      action,
      reasons,
      onClose,
      handleSubmit,
      customReason,
      currentValues,
      item,
      submitting,
      pristine,
      invalid,
    } = this.props;

    return (
      <Modal className="modal-danger" isOpen toggle={onClose}>
        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <ModalHeader toggle={onClose}>
            {I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CANCEL.TITLE')}
          </ModalHeader>
          <ModalBody>
            <div className="text-center margin-vertical-20">
              <span className="font-weight-700">
                {I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CANCEL.ACTION_TEXT', {
                  title: item.name,
                  action: renderLabel(action, actionLabels).toLowerCase(),
                })}
              </span>
              {' - '}
              <Uuid uuid={item.uuid} />
              {' - '}
              <span className="font-weight-700">{I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CANCEL.ENTITY_NAME')}</span>
            </div>
            {reasons && Object.keys(reasons).length > 0 && this.renderReasonsSelect(reasons, customReason)}
            {
              currentValues && currentValues.reason === CUSTOM_REASON &&
              <Field
                name="customReason"
                placeholder={I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CANCEL.CUSTOM_REASON_PLACEHOLDER')}
                label={''}
                position="vertical"
                component={TextAreaField}
                rows={3}
              />
            }
          </ModalBody>

          <ModalFooter>
            <button
              className="btn btn-default-outline mr-auto"
              onClick={onClose}
            >
              {I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CANCEL.CLOSE_BUTTON')}
            </button>
            <button
              className="btn btn-danger"
              type="submit"
              disabled={pristine || submitting || invalid}
            >
              {I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CANCEL.CANCEL_BUTTON')}
            </button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

const validatorAttributeLabels = Object.keys(attributeLabels).reduce((res, name) => ({
  ...res,
  [name]: I18n.t(attributeLabels[name]),
}), {});
export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(
  reduxForm({
    form: FORM_NAME,
    validate: (data, props) => {
      const rules = {
        reason: `required|string|in:${Object.keys(props.reasons).join()},custom`,
      };

      if (data.reason === CUSTOM_REASON) {
        rules.customReason = 'required|string|min:3';
      }

      return createValidator(rules, validatorAttributeLabels, false)(data);
    }
    ,
  })(CancelModal),
);
