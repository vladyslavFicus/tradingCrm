import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { getFormValues, Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import PropTypes from '../../../../constants/propTypes';
import { createValidator } from '../../../../utils/validator';
import { TextAreaField, SelectField } from '../../../../components/ReduxForm';
import Uuid from '../../../../components/Uuid';
import './ChangeStatusModal.scss';

const CUSTOM_REASON = 'custom';
const FORM_NAME = 'bonusCampaignStatusDropDownModal';
const attributeLabels = {
  reason: 'Reason',
  customReason: '',
};
const validator = (data) => {
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
};

class ChangeStatusModal extends Component {
  static propTypes = {
    campaign: PropTypes.bonusCampaignEntity.isRequired,
    isOpen: PropTypes.bool,
    show: PropTypes.bool,
    action: PropTypes.string,
    reasons: PropTypes.object,
    onHide: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    customReason: PropTypes.bool,
    submitButtonLabel: PropTypes.string,
    submitButtonClassName: PropTypes.string,
    currentValues: PropTypes.shape({
      reason: PropTypes.string,
      customReason: PropTypes.string,
    }).isRequired,
  };
  static defaultProps = {
    reasons: {},
    submitButtonLabel: 'Submit',
    submitButtonClassName: '',
    customReason: false,
    currentValues: {
      reason: '',
      customReason: '',
    },
  };

  handleSubmit = ({ reason, customReason }) => {
    const { onSubmit, action } = this.props;

    return onSubmit({ reason: customReason || reason, action });
  };

  renderReasonsSelect = (reasons, customReason = false) => (
    <div className="form-group">
      <Field
        name="reason"
        label={attributeLabels.reason}
        component={SelectField}
        position="vertical"
        className={'form-control'}
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
      show,
      action,
      submitButtonLabel,
      submitButtonClassName,
      reasons,
      onHide,
      onSubmit,
      handleSubmit,
      customReason,
      currentValues,
      campaign,
      ...rest
    } = this.props;

    return (
      <Modal {...rest} className="bonus-campaign-change-status-modal" isOpen={show} toggle={onHide}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={onHide}>
            {I18n.t('BONUS_CAMPAIGNS.CHANGE_STATUS_MODAL.TITLE')}
          </ModalHeader>
          <ModalBody>
            <div className="text-center margin-vertical-20">
              <span className="font-weight-700">
                {I18n.t('BONUS_CAMPAIGNS.CHANGE_STATUS_MODAL.ACTION_TEXT', {
                  title: campaign.campaignName,
                  action: I18n.t(action).toLowerCase(),
                })}
              </span>
              {' - '}
              <Uuid uuid={campaign.campaignUUID} uuidPrefix="CO" />
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
            <div className="row">
              <div className="col-md-6">
                <button className="btn btn-default-outline text-uppercase" onClick={onHide}>
                  {I18n.t('BONUS_CAMPAIGNS.CHANGE_STATUS_MODAL.CANCEL_BUTTON')}
                </button>
              </div>
              <div className="col-md-6 text-right">
                <button className={classNames(submitButtonClassName, 'btn text-uppercase')} type="submit">
                  {I18n.t(submitButtonLabel)}
                </button>
              </div>
            </div>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(
  reduxForm({
    form: FORM_NAME,
    validate: validator,
  })(ChangeStatusModal)
);
