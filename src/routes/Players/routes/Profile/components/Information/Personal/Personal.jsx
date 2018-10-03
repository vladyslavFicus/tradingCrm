import React, { PureComponent } from 'react';
import moment from 'moment';
import { get } from 'lodash';
import { I18n } from 'react-redux-i18n';
import Switch from '../../../../../../../components/Forms/Switch';
import PersonalInformationItem from '../../../../../../../components/Information/PersonalInformationItem';
import FieldView from '../../../../../../../components/FieldView';
import PropTypes from '../../../../../../../constants/propTypes';
import { statuses as kycStatuses } from '../../../../../../../constants/kyc';
import { statuses as userStatuses } from '../../../../../../../constants/user';

class Personal extends PureComponent {
  handleOpenUpdateFieldModal = (fieldName, fieldLabel, onSubmit, title, form) => {
    const {
      data,
      modals: { updateFiledModal },
    } = this.props;

    updateFiledModal.show({
      onSubmit,
      form,
      fieldName,
      fieldLabel,
      initialValues: {
        [fieldName]: data[fieldName],
      },
      title,
    });
  };

  handleClickBTAG = () => {
    const { data: { playerUUID } } = this.props;

    this.handleOpenUpdateFieldModal('btag', 'B-TAG', async (data) => {
      const result = await this.props.updateBTAGMutation({
        variables: {
          ...data,
          playerUUID,
        },
      });

      return get(result, 'data.profile.updateBTAG');
    }, 'PLAYER_PROFILE.PROFILE.PERSONAL.UPDATE_BTAG', 'btag-form');
  };

  handleClickSource = () => {
    const { data: { playerUUID } } = this.props;

    this.handleOpenUpdateFieldModal('affiliateId', 'Source', async (data) => {
      const result = await this.props.updateAffiliateMutation({
        variables: {
          ...data,
          playerUUID,
        },
      });

      return get(result, 'data.profile.updateAffiliate');
    }, 'PLAYER_PROFILE.PROFILE.PERSONAL.UPDATE_SOURCE', 'source-form');
  };

  handleSwitchIsTest = async (isTest) => {
    const {
      data: { playerUUID },
      markIsTest,
      notify,
    } = this.props;

    const response = await markIsTest({ variables: { playerUUID, isTest } });

    const error = get(response, 'data.profile.markIsTest.error');

    notify({
      level: error ? 'error' : 'success',
      title: isTest
        ? I18n.t('PLAYER_PROFILE.NOTIFICATIONS.SET_PLAYER_AS_TEST')
        : I18n.t('PLAYER_PROFILE.NOTIFICATIONS.UN_SET_PLAYER_AS_TEST'),
    });
  };

  render() {
    const {
      data: {
        birthDate,
        gender,
        phoneNumber,
        email,
        country,
        address,
        kycAddressStatus,
        kycPersonalStatus,
        profileStatus,
        phoneNumberVerified,
        city,
        affiliateId,
        btag,
        intendedAmountToSpend,
        isTest,
      },
    } = this.props;

    return (
      <div className="account-details__personal-info">
        <span className="account-details__label">
          {I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.TITLE')}
        </span>
        <div className="card">
          <div className="card-body">
            <PersonalInformationItem
              label="Date of birth"
              value={birthDate ? moment(birthDate).format('DD.MM.YYYY') : null}
              verified={kycPersonalStatus && kycPersonalStatus.status === kycStatuses.VERIFIED}
            />
            <PersonalInformationItem
              label="Gender"
              value={gender}
              verified={kycPersonalStatus && kycPersonalStatus.status === kycStatuses.VERIFIED}
            />
            <PersonalInformationItem
              label="Phone"
              value={phoneNumber}
              verified={phoneNumberVerified}
            />
            <PersonalInformationItem
              label="Email"
              value={email}
              verified={profileStatus === userStatuses.ACTIVE}
            />
            <PersonalInformationItem
              label="Full address"
              value={address}
              verified={kycAddressStatus && kycAddressStatus.status === kycStatuses.VERIFIED}
            />
            <PersonalInformationItem
              label="Country"
              value={country}
              verified={kycAddressStatus && kycAddressStatus.status === kycStatuses.VERIFIED}
            />
            <PersonalInformationItem
              label="City"
              value={city}
              verified={kycAddressStatus && kycAddressStatus.status === kycStatuses.VERIFIED}
            />
            <PersonalInformationItem
              label="Intended amount to spend"
              value={intendedAmountToSpend}
            />
            <FieldView
              label="Source"
              onClick={this.handleClickSource}
              value={affiliateId || <span className="color-default">no source</span>}
            />
            <FieldView
              label="B-TAG"
              onClick={this.handleClickBTAG}
              value={btag || <span className="color-default">no b-tag</span>}
            />
            <div className="font-size-13">
              <span className="font-weight-700">Test player: </span>
              <div className="float-right">
                <Switch
                  active={isTest || false}
                  handleSwitch={this.handleSwitchIsTest}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Personal.propTypes = {
  markIsTest: PropTypes.func.isRequired,
  updateAffiliateMutation: PropTypes.func.isRequired,
  updateBTAGMutation: PropTypes.func.isRequired,
  modals: PropTypes.shape({
    updateFiledModal: PropTypes.shape({
      show: PropTypes.func.isRequired,
    }),
  }).isRequired,
  data: PropTypes.shape({
    address: PropTypes.string,
    affiliateId: PropTypes.string,
    birthDate: PropTypes.string,
    btag: PropTypes.string,
    city: PropTypes.string,
    completed: PropTypes.bool,
    country: PropTypes.string,
    email: PropTypes.string,
    gender: PropTypes.string,
    kycPersonalStatus: PropTypes.string,
    profileVerified: PropTypes.bool,
    languageCode: PropTypes.string,
    kycAddressStatus: PropTypes.string,
    phoneNumber: PropTypes.string,
    phoneNumberVerified: PropTypes.bool,
    postCode: PropTypes.string,
    login: PropTypes.string,
    username: PropTypes.string,
    playerUUID: PropTypes.string,
    intendedAmountToSpend: PropTypes.string,
  }),
};
Personal.defaultProps = {
  data: {},
};

export default Personal;
