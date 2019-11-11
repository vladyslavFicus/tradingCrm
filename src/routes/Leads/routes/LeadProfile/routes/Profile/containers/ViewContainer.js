import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { get } from 'lodash';
import { withNotifications } from '../../../../../../../components/HighOrder';
import { leadProfileQuery } from '../../../../../../../graphql/queries/leads';
import { updateLeadProfile } from '../../../../../../../graphql/mutations/leads';
import { createValidator } from '../../../../../../../utils/validator';
import countryList, { getCountryCode } from '../../../../../../../utils/countryList';
import { attributeLabels } from '../constants';
import View from '../components/View';

const countryCodes = Object.keys(countryList);

const mapStateToProps = (_, { leadProfile: { leadProfile } }) => {
  const error = get(leadProfile, 'error');

  if (error) {
    return {};
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
  } = get(leadProfile, 'data') || {};

  return {
    initialValues: {
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
    },
  };
};

export default compose(
  withNotifications,
  graphql(updateLeadProfile, {
    name: 'updateLead',
  }),
  graphql(leadProfileQuery, {
    options: ({
      match: {
        params: {
          id: leadId,
        },
      },
    }) => ({
      variables: {
        leadId,
      },
    }),
    name: 'leadProfile',
  }),
  connect(mapStateToProps),
  reduxForm({
    form: 'leadProfileForm',
    touchOnChange: true,
    validate: createValidator({
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
    }, attributeLabels, false),
    enableReinitialize: true,
  }),
)(View);
