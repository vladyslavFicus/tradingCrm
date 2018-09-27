import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import { SubmissionError } from 'redux-form';
import NotFound from '../../../../../routes/NotFound';
import PropTypes from '../../../../../constants/propTypes';
import HideDetails from '../../../../../components/HideDetails';
import Information from './Information';
import Header from './Header';

class LeadProfile extends Component {
  static propTypes = {
    leadProfile: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      leadProfile: PropTypes.shape({
        data: PropTypes.lead,
        error: PropTypes.object,
      }),
      refetch: PropTypes.func.isRequired,
    }).isRequired,
    promoteLead: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      promoteLeadModal: PropTypes.modalType,
    }).isRequired,
  };

  handlePromoteLead = async (values) => {
    const {
      notify,
      promoteLead,
      leadProfile: {
        refetch,
        leadProfile: {
          data: {
            phoneCode,
            phoneNumber,
            city,
            brandId,
          },
        },
      },
      modals: {
        promoteLeadModal,
      },
    } = this.props;

    const { data: { leads: { promote: { data, error } } } } = await promoteLead({
      variables: {
        ...values,
        phone: phoneNumber,
        phoneCode,
        city,
        brandId,
      },
    });

    if (error) {
      const formError = Object
        .entries(error.fields_errors)
        .map(([key, { error: err }]) => `${key}: ${err}`);

      throw new SubmissionError({ _error: formError.join(', ') });
    } else {
      await refetch();
      promoteLeadModal.hide();
      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('LEADS.SUCCESS_PROMOTED', { id: data.playerUUID }),
      });
    }
  }

  triggerLeadModal = () => {
    const {
      leadProfile: {
        leadProfile: {
          data: {
            name,
            surname,
            email,
            country,
            language,
          },
        },
      },
      modals: { promoteLeadModal },
    } = this.props;

    promoteLeadModal.show({
      onSubmit: values => this.handlePromoteLead(values),
      initialValues: {
        firstName: name,
        lastName: surname,
        email,
        country,
        languageCode: language,
      },
    });
  }

  render() {
    const {
      leadProfile: {
        loading,
        leadProfile,
      },
    } = this.props;

    const data = get(leadProfile, 'data') || {};
    const error = get(leadProfile, 'error');

    if (error) {
      return <NotFound />;
    }

    return (
      <div className="profile">
        <div className="profile__info">
          <Header
            data={data}
            loading={loading}
            onPromoteLeadClick={this.triggerLeadModal}
          />
          <HideDetails>
            <Information
              data={data}
              loading={loading}
            />
          </HideDetails>
        </div>
      </div>
    );
  }
}

export default LeadProfile;
