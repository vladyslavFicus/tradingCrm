import React, { PureComponent } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';
import { createValidator, translateLabels } from '../../utils/validator';
import { NasSelectField, CheckBox } from '../../components/ReduxForm';
import { attributeLabels, attributePlaceholders } from './constants';
import SelectCampaignOption from './SelectCampaignOption';
import SelectCampaignOptionsHeader from './SelectCampaignOptionsHeader';
import './AddToCampaignModal.scss';
import { statuses as bonusCampaignStatuses } from '../../constants/bonus-campaigns';
import shallowEqual from '../../utils/shallowEqual';

class AddToCampaignModal extends PureComponent {
  static propTypes = {
    campaigns: PropTypes.arrayOf(PropTypes.bonusCampaignEntity).isRequired,
    handleSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
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
      }));
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
      title,
      message,
    } = this.props;

    return (
      <Modal className="add-to-campaign-modal" toggle={onClose} isOpen>
        <ModalHeader toggle={onClose}>{title}</ModalHeader>
        <ModalBody id="add-to-campaign-modal-form" tag="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="add-to-campaign-modal__header">{message}</div>
          <Field
            name="campaignUuid"
            label={I18n.t(attributeLabels.campaignUuid)}
            labelAddon={
              <Field
                id="add-to-camp-modal-checkbox"
                name="add-to-camp-modal-checkbox"
                component={CheckBox}
                type="checkbox"
                onChange={this.handleOnlyActiveCampaignsClick}
                label={I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.MODALS.ADD_TO_CAMPAIGN.ACTIVE_ONLY')}
              />
            }
            component={NasSelectField}
            position="vertical"
            placeholder={I18n.t(attributePlaceholders.campaignUuid)}
            optionsHeader={SelectCampaignOptionsHeader}
            singleOptionComponent={SelectCampaignOption}
          >
            {options.map(campaign => (
              <option key={campaign.uuid} value={campaign.uuid} campaign={campaign}>
                {`${campaign.name} - ${campaign.state}`}
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
            form="add-to-campaign-modal-form"
          >
            {I18n.t('COMMON.CONFIRM')}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default reduxForm({
  form: 'addToCampaignModal',
  validate: createValidator({
    campaignUuid: ['required'],
  }, translateLabels(attributeLabels), false),
})(AddToCampaignModal);
