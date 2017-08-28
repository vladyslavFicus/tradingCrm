import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { Field } from 'redux-form';
import renderLabel from '../../../../../../../../utils/renderLabel';
import { SelectField } from '../../../../../../../../components/ReduxForm';
import { campaignMenu } from '../../../../../../../../constants/bonus-campaigns';

const CampaignFulfillment = ({ label }) => (
  <div className="add-campaign-container">
    <div className="add-campaign-label">
      {label}
    </div>
    <div className="form-row">
      <div className="form-row__big">
        <Field
          name="wageredAmount"
          label=""
          labelClassName="no-label"
          type="text"
          component={SelectField}
          position="vertical"
        >
          <option value="">{I18n.t('BONUS_CAMPAIGNS.FULFILLMENTS.CHOOSE_CAMPAIGN')}</option>
          {Object.keys(campaignMenu).map(key => (
            <option key={key} value={key}>
              {renderLabel(key, campaignMenu)}
            </option>
          ))}
        </Field>
      </div>
    </div>
    <button className="btn-transparent add-campaign-remove">&times;</button>
  </div>
);

CampaignFulfillment.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default CampaignFulfillment;
