import React, { PureComponent } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../../constants/propTypes';
import { createValidator, translateLabels } from '../../../../../../../../utils/validator';
import { NasSelectField } from '../../../../../../../../components/ReduxForm';
import { attributeLabels, attributePlaceholders } from './constants';
import SelectCampaignOption from '../SelectCampaignOption';
import SelectCampaignOptionsHeader from '../SelectCampaignOptionsHeader';
import './AddToCampaignModal.scss';
import { statuses as bonusCampaignStatuses } from '../../../../../../../../constants/bonus-campaigns';
import shallowEqual from '../../../../../../../../utils/shallowEqual';

class AddToCampaignModal extends PureComponent {
  static propTypes = {
    campaigns: PropTypes.arrayOf(PropTypes.bonusCampaignEntity).isRequired,
    handleSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    fullName: PropTypes.string.isRequired,
  };
  static defaultProps = {
    pristine: false,
    submitting: false,
    handleSubmit: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      activeOnly: false,
      options: props.campaigns,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { activeOnly } = this.state;
    const { campaigns } = this.props;

    if (!shallowEqual(campaigns, nextProps.campaigns)) {
      this.setState({
        options: nextProps.campaigns
          .filter(campaign => (activeOnly ? campaign.state === bonusCampaignStatuses.ACTIVE : true)),
      });
    }
  }

  handleOnlyActiveCampaignsClick = () => {
    const activeOnly = !this.state.activeOnly;
    const { campaigns } = this.props;

    requestAnimationFrame(() =>
      this.setState({
        activeOnly,
        options: campaigns
          .filter(campaign => (activeOnly ? campaign.state === bonusCampaignStatuses.ACTIVE : true)),
      })
    );
  };

  render() {
    const { options } = this.state;
    const {
      onSubmit,
      handleSubmit,
      onClose,
      pristine,
      submitting,
      invalid,
      fullName,
    } = this.props;

    return (
      <Modal className="add-to-campaign-modal" toggle={onClose} isOpen>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={onClose}>
            {I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.MODALS.ADD_TO_CAMPAIGN.TITLE')}
          </ModalHeader>
          <ModalBody>
            <div className="add-to-campaign-modal__header">
              {I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.MODALS.ADD_TO_CAMPAIGN.ACTION', { fullName })}
            </div>
            <Field
              name="campaignUuid"
              label={I18n.t(attributeLabels.campaignUuid)}
              labelClassName="form-label clearfix"
              labelTag="div"
              labelAddon={
                <div className="pull-right">
                  <label>
                    <input type="checkbox" onClick={this.handleOnlyActiveCampaignsClick} />
                    {' '}
                    {I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.MODALS.ADD_TO_CAMPAIGN.ACTIVE_ONLY')}
                  </label>
                </div>
              }
              component={NasSelectField}
              position="vertical"
              placeholder={I18n.t(attributePlaceholders.campaignUuid)}
              optionsHeader={SelectCampaignOptionsHeader}
              singleOptionComponent={SelectCampaignOption}
            >
              {options.map(campaign => (
                <option key={campaign.uuid} value={campaign.uuid} campaign={campaign}>
                  {`${campaign.campaignName} - ${campaign.state}`}
                </option>
              ))}
            </Field>

          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-default-outline"
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

const FORM_NAME = 'addToCampaignModal';
export default reduxForm({
  form: FORM_NAME,
  validate: createValidator({
    campaignUuid: ['required'],
  }, translateLabels(attributeLabels), false),
})(AddToCampaignModal);
