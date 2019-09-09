import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'constants/propTypes';
import { InputField } from 'components/ReduxForm';

const BankDetailsForm = ({ disabled }) => (
  <form>
    <div className="row margin-bottom-20">
      <div className="col personal-form-heading">
        {I18n.t('PLAYER_PROFILE.PROFILE.BANK_DETAILS.TITLE')}
      </div>
    </div>
    <div className="row">
      <Field
        name="accountHolderName"
        type="text"
        label={I18n.t('PLAYER_PROFILE.PROFILE.BANK_DETAILS.ACCOUNT_HOLDER_NAME')}
        placeholder={I18n.t('PLAYER_PROFILE.PROFILE.BANK_DETAILS.ACCOUNT_HOLDER_NAME')}
        component={InputField}
        disabled={disabled}
        className="col-lg-3"
      />
      <Field
        name="accountNumber"
        type="text"
        label={I18n.t('PLAYER_PROFILE.PROFILE.BANK_DETAILS.ACCOUNT_NUMBER')}
        placeholder={I18n.t('PLAYER_PROFILE.PROFILE.BANK_DETAILS.ACCOUNT_NUMBER')}
        component={InputField}
        disabled={disabled}
        className="col-lg-3"
      />
      <Field
        name="branchName"
        type="text"
        label={I18n.t('PLAYER_PROFILE.PROFILE.BANK_DETAILS.BRANCH_NAME')}
        placeholder={I18n.t('PLAYER_PROFILE.PROFILE.BANK_DETAILS.BRANCH_NAME')}
        component={InputField}
        disabled={disabled}
        className="col-lg-3"
      />
      <Field
        name="city"
        type="text"
        label={I18n.t('PLAYER_PROFILE.PROFILE.BANK_DETAILS.CITY')}
        placeholder={I18n.t('PLAYER_PROFILE.PROFILE.BANK_DETAILS.CITY')}
        component={InputField}
        disabled={disabled}
        className="col-lg-3"
      />
      <Field
        name="name"
        type="text"
        label={I18n.t('PLAYER_PROFILE.PROFILE.BANK_DETAILS.NAME')}
        placeholder={I18n.t('PLAYER_PROFILE.PROFILE.BANK_DETAILS.NAME')}
        component={InputField}
        disabled={disabled}
        className="col-lg-3"
      />
      <Field
        name="province"
        type="text"
        label={I18n.t('PLAYER_PROFILE.PROFILE.BANK_DETAILS.PROVINCE')}
        placeholder={I18n.t('PLAYER_PROFILE.PROFILE.BANK_DETAILS.PROVINCE')}
        component={InputField}
        disabled={disabled}
        className="col-lg-3"
      />
      <Field
        name="swiftCode"
        type="text"
        label={I18n.t('PLAYER_PROFILE.PROFILE.BANK_DETAILS.SWIFT_CODE')}
        placeholder={I18n.t('PLAYER_PROFILE.PROFILE.BANK_DETAILS.SWIFT_CODE')}
        component={InputField}
        disabled={disabled}
        className="col-lg-3"
      />
      <Field
        name="withdrawalArea"
        type="text"
        label={I18n.t('PLAYER_PROFILE.PROFILE.BANK_DETAILS.WITHDRAW_AREA')}
        placeholder={I18n.t('PLAYER_PROFILE.PROFILE.BANK_DETAILS.WITHDRAW_AREA')}
        component={InputField}
        disabled={disabled}
        className="col-lg-3"
      />
    </div>
  </form>
);

BankDetailsForm.propTypes = {
  disabled: PropTypes.bool,
};

BankDetailsForm.defaultProps = {
  disabled: false,
};

export default reduxForm({
  form: 'blankDetailsForm',
  enableReinitialize: true,
})(BankDetailsForm);
