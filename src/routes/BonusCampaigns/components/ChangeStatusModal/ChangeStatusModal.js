import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { getFormValues, Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../constants/propTypes';
import renderLabel from '../../../../utils/renderLabel';
import { createValidator } from '../../../../utils/validator';
import { TextAreaField, SelectField } from '../../../../components/ReduxForm';
import Uuid from '../../../../components/Uuid';
import { actionLabels } from '../../../../constants/bonus-campaigns';
import { attributeLabels } from './constants';

const CUSTOM_REASON = 'custom';

class ChangeStatusModal extends Component {
  static propTypes = {
    campaign: PropTypes.bonusCampaignEntity.isRequired,
    action: PropTypes.string,
    reasons: PropTypes.object,
    onHide: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    customReason: PropTypes.bool,
    submitButtonLabel: PropTypes.string,
    currentValues: PropTypes.shape({
      reason: PropTypes.string,
      customReason: PropTypes.string,
    }).isRequired,
    className: PropTypes.string,
  };
  static defaultProps = {
    action: '',
    reasons: {},
    submitButtonLabel: 'Submit',
    customReason: false,
    currentValues: {
      reason: '',
      customReason: '',
    },
    handleSubmit: null,
    className: 'modal-danger',
  };

  handleSubmit = ({ reason, customReason }) => {
    const { onSubmit, action } = this.props;

    return onSubmit({ reason: customReason || reason, action });
  };

  renderReasonsSelect = (reasons, customReason = false) => (
    <div className="form-group">
      <Field
        name="reason"
        label={I18n.t(attributeLabels.reason)}
        component={SelectField}
        position="vertical"
      >
        <option value="">
          {I18n.t('BONUS_CAMPAIGNS.CHANGE_STATUS_MODAL.SELECT_REASON_OPTION')}
        </option>
        {Object.keys(reasons).map(key => (
          <option key={key} value={key}>
            {I18n.t(reasons[key])}
          </option>
        ))}
        {
          customReason &&
          <option value="custom">
            {I18n.t('BONUS_CAMPAIGNS.CHANGE_STATUS_MODAL.CUSTOM_REASON_OPTION')}
          </option>
        }
      </Field>
    </div>
  );

  render() {
    const {
      action,
      submitButtonLabel,
      reasons,
      onHide,
      onSubmit,
      handleSubmit,
      customReason,
      currentValues,
      campaign,
      className,
    } = this.props;

    return (
      <Modal isOpen toggle={onHide} className={className}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={onHide}>
            {I18n.t('BONUS_CAMPAIGNS.CHANGE_STATUS_MODAL.TITLE')}
          </ModalHeader>
          <ModalBody>
            <div className="text-center margin-vertical-20">
              <span className="font-weight-700">
                {I18n.t('BONUS_CAMPAIGNS.CHANGE_STATUS_MODAL.ACTION_TEXT', {
                  title: campaign.campaignName,
                  action: renderLabel(action, actionLabels).toLowerCase(),
                })}
              </span>
              {' - '}
              <Uuid uuid={campaign.uuid} uuidPrefix="CA" />
              {' - '}
              <span className="font-weight-700">{I18n.t('BONUS_CAMPAIGNS.CHANGE_STATUS_MODAL.ENTITY_NAME')}</span>
            </div>

            {reasons && Object.keys(reasons).length > 0 && this.renderReasonsSelect(reasons, customReason)}

            {
              currentValues && currentValues.reason === CUSTOM_REASON &&
              <Field
                name="customReason"
                placeholder={I18n.t('BONUS_CAMPAIGNS.CHANGE_STATUS_MODAL.CUSTOM_REASON_PLACEHOLDER')}
                label={''}
                position="vertical"
                component={TextAreaField}
              />
            }
          </ModalBody>

          <ModalFooter>
            <button className="btn btn-default-outline pull-left" onClick={onHide}>
              {I18n.t('BONUS_CAMPAIGNS.CHANGE_STATUS_MODAL.CANCEL_BUTTON')}
            </button>
            <button className="btn btn-danger" type="submit">
              {I18n.t(submitButtonLabel)}
            </button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

const FORM_NAME = 'bonusCampaignStatusDropDownModal';

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(
  reduxForm({
    form: FORM_NAME,
    validate: (data) => {
      const rules = {
        reason: 'string',
      };

      if (data.reasons) {
        rules.reason = `required|string|in:${Object.keys(data.reasons).join()},custom`;
      }

      if (data.reason === CUSTOM_REASON) {
        rules.customReason = 'required|string|min:3';
      }

      return createValidator(rules, attributeLabels, false)(data);
    },
  })(ChangeStatusModal)
);
