import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { Formik, Form } from 'formik';
import { withRequests, parseErrors } from 'apollo';
import { withNotifications } from 'hoc';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { withPermission } from 'providers/PermissionsProvider';
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

class LeadProfileTab extends PureComponent {
  static propTypes = {
    leadProfile: PropTypes.query({
      lead: PropTypes.lead,
    }).isRequired,
    updateLead: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    permission: PropTypes.permission.isRequired,
  };

  state = {
    submitError: null,
  };

  handleUpdateLead = async (variables, { setSubmitting }) => {
    const { notify, updateLead, leadProfile } = this.props;

    setSubmitting(false);

    try {
      await updateLead({ variables });

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('LEAD_PROFILE.UPDATED'),
      });

      leadProfile.refetch();
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: 'error',
        title: I18n.t('LEAD_PROFILE.NOTIFICATION_FAILURE'),
        message: error.error === 'error.entity.already.exist'
          ? I18n.t('lead.error.entity.already.exist', { email: variables.email })
          : I18n.t('COMMON.SOMETHING_WRONG'),
      });
      this.setState({
        submitError: error.error === 'error.entity.already.exist'
          ? I18n.t('lead.error.entity.already.exist', { email: variables.email })
          : error.message,
      });
    }
  };

  render() {
    const {
      leadProfile,
      permission,
    } = this.props;

    const error = get(leadProfile, 'error');

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
    } = get(leadProfile, 'data.lead') || {};

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
          email: permission.allows(permissions.LEAD_PROFILE.FIELD_EMAIL) ? 'email' : 'string',
        }, translateLabels(attributeLabels), false)}
        enableReinitialize
      >
        {({ isValid, isSubmitting, dirty }) => (
          <Form className="LeadProfileTab">
            <TabHeader title={I18n.t('PLAYER_PROFILE.PROFILE.TITLE')}>
              <If condition={dirty && !isSubmitting && isValid}>
                <Button type="submit" primaryOutline>
                  {I18n.t('COMMON.SAVE_CHANGES')}
                </Button>
              </If>
            </TabHeader>
            <If condition={this.state.submitError}>
              <div className="LeadProfileTab__error">
                {this.state.submitError}
              </div>
            </If>
            <div className="tab-wrapper">
              <div className="card">
                <div className="card-body row">
                  <div className="col">
                    <PersonalForm />
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body row">
                  <div className="col">
                    <AddressForm />
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body row">
                  <div className="col">
                    <ContactForm />
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}

export default compose(
  withPermission,
  withNotifications,
  withRequests({
    leadProfile: LeadProfileQuery,
    updateLead: LeadProfileUpdate,
  }),
)(LeadProfileTab);
