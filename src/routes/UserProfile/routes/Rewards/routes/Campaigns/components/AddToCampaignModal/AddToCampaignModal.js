import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../../constants/propTypes';
import { createValidator } from '../../../../../../../../utils/validator';
import { NasSelectField } from '../../../../../../../../components/ReduxForm';
import { attributeLabels, attributePlaceholders } from './constants';

class AddToCampaignModal extends Component {
  static propTypes = {
    campaigns: PropTypes.arrayOf(PropTypes.bonusCampaignEntity).isRequired,
    handleSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    fullName: PropTypes.string.isRequired,
  };
  static defaultProps = {
    pristine: false,
    submitting: false,
    invalid: false,
    handleSubmit: null,
  };

  render() {
    const {
      onSubmit,
      handleSubmit,
      onClose,
      pristine,
      submitting,
      invalid,
      campaigns,
      fullName,
    } = this.props;

    return (
      <Modal className="add-to-campaign-modal" toggle={onClose} isOpen>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={onClose}>
            {I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.MODALS.ADD_TO_CAMPAIGN.TITLE')}
          </ModalHeader>
          <ModalBody>
            <div className="row margin-bottom-20 font-weight-700">
              <div className="col-md-8 col-md-offset-2 text-center">
                {I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.MODALS.ADD_TO_CAMPAIGN.ACTION', { fullName })}
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <Field
                  name="campaignId"
                  label={I18n.t(attributeLabels.campaignId)}
                  labelClassName="form-label"
                  component={NasSelectField}
                  position="vertical"
                  placeholder={I18n.t(attributePlaceholders.campaignId)}
                >
                  {campaigns.map(campaign => (
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.campaignName}
                    </option>
                  ))}
                </Field>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-default-outline pull-left"
              disabled={submitting}
              type="reset"
              onClick={onClose}
            >
              {I18n.t('COMMON.CANCEL')}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={pristine || submitting || invalid}
            >
              {I18n.t('COMMON.CONFIRM')}
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
const FORM_NAME = 'addToCampaignModal';
export default reduxForm({
  form: FORM_NAME,
  validate: createValidator({
    campaignId: ['required'],
  }, validatorAttributeLabels, false),
})(AddToCampaignModal);
