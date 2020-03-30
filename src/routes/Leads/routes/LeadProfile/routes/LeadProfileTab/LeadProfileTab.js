import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { Formik, Form } from 'formik';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import TabHeader from 'components/TabHeader';
import Button from 'components/UI/Button';
import { createValidator, translateLabels } from 'utils/validator';
import countryList, { getCountryCode } from 'utils/countryList';
import PersonalForm from './components/PersonalForm';
import AddressForm from './components/AddressForm';
import ContactForm from './components/ContactForm';
import LeadProfileUpdate from './graphql/LeadProfileUpdate';
import LeadProfileQuery from './graphql/LeadProfileQuery';
import { attributeLabels } from './constants';
import './LeadProfileTab.scss';

const countryCodes = Object.keys(countryList);

class Profile extends PureComponent {
  static propTypes = {
    leadProfile: PropTypes.query({
      leadProfile: PropTypes.shape({
        data: PropTypes.lead,
        error: PropTypes.any,
      }),
    }).isRequired,
    updateLead: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
  };

  state = {
    submitError: null,
  };

  handleUpdateLead = async (variables) => {
    const { notify, updateLead } = this.props;
    const { data: { leads: { update: { error } } } } = await updateLead({
      variables,
    });

    if (error) {
      notify({
        level: 'error',
        title: I18n.t('LEAD_PROFILE.NOTIFICATION_FAILURE'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
      this.setState({
        submitError: error.error,
      });
    } else {
      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('LEAD_PROFILE.UPDATED'),
      });
    }
  };

  render() {
    const { leadProfile } = this.props;

    const error = get(leadProfile, 'data.leadProfile.error');

    if (error) {
      return null;
    }

    const {
      uuid,
      brandId,
      name,
      surname,
      phone,
      mobile,
      email,
      country,
      birthDate,
      gender,
      city,
    } = get(leadProfile, 'data.leadProfile.data') || {};

    return (
      <Formik
        initialValues={{
          uuid,
          brandId,
          name,
          surname,
          phone,
          mobile,
          email,
          country: getCountryCode(country),
          birthDate,
          gender,
          city,
        }}
        onSubmit={this.handleUpdateLead}
        validate={createValidator({
          firstName: 'string',
          lastName: 'string',
          birthDate: 'regex:/^\\d{4}-\\d{2}-\\d{2}$/',
          identifier: 'string',
          country: `in:${countryCodes.join()}`,
          city: ['string', 'min:3'],
          postCode: ['string', 'min:3'],
          address: 'string',
          phone: 'string',
          mobile: 'string',
          email: 'email',
        }, translateLabels(attributeLabels), false)}
        enableReinitialize
      >
        {({ isValid, isSubmitting, dirty }) => (
          <Form className="Profile">
            <TabHeader title={I18n.t('PLAYER_PROFILE.PROFILE.TITLE')}>
              <If condition={dirty && !isSubmitting && isValid}>
                <Button type="submit" primaryOutline>
                  {I18n.t('COMMON.SAVE_CHANGES')}
                </Button>
              </If>
            </TabHeader>
            <If condition={this.state.submitError}>
              <div className="Profile__error">
                {this.state.submitError}
              </div>
            </If>
            <div className="tab-wrapper">
              {[PersonalForm, AddressForm, ContactForm].map(Card => (
                <div className="card" key={Card.name}>
                  <div className="card-body row">
                    <div className="col">
                      <Card />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}

export default compose(
  withNotifications,
  withRequests({
    leadProfile: LeadProfileQuery,
    updateLead: LeadProfileUpdate,
  }),
)(Profile);
