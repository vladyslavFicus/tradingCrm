import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { InputField } from '../../../../components/ReduxForm';
import { attributeLabels } from '../../constants';
import { withReduxFormValues } from '../../../../components/HighOrder';
import './Form.scss';

const CAMPAIGN_NAME_MAX_LENGTH = 100;

class Form extends Component {
  static propTypes = {
    reset: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    disabled: PropTypes.bool,
    form: PropTypes.string.isRequired,
    currentValues: PropTypes.shape({
      name: PropTypes.string,
    }),
  };

  static defaultProps = {
    handleSubmit: null,
    pristine: false,
    submitting: false,
    currentValues: {},
    disabled: false,
  };

  handleRevert = () => {
    this.props.reset();
  };

  render() {
    const {
      handleSubmit,
      onSubmit,
      pristine,
      submitting,
      currentValues,
      disabled,
      form,
    } = this.props;

    return (
      <form id={form} className="campaign-settings" onSubmit={handleSubmit(onSubmit)}>
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-6 text-truncate campaign-settings__title">
              {I18n.t('BONUS_CAMPAIGNS.SETTINGS.CAMPAIGN_SETTINGS')}
            </div>
            {
              !(pristine || submitting || disabled) &&
              <div className="col-md-6 text-md-right">
                <button
                  onClick={this.handleRevert}
                  className="btn btn-default-outline text-uppercase margin-right-20"
                  type="button"
                >
                  {I18n.t('COMMON.REVERT_CHANGES')}
                </button>
                <button className="btn btn-primary text-uppercase" type="submit" id="bonus-campaign-save-button">
                  {I18n.t('COMMON.SAVE_CHANGES')}
                </button>
              </div>
            }
          </div>
          <hr />
          <div className="row">
            <div className="col-md-7">
              <Field
                id={`${form}Name`}
                name="name"
                label={I18n.t(attributeLabels.campaignName)}
                type="text"
                component={InputField}
                position="vertical"
                disabled={disabled}
              />
              <div className="form-group__note">
                {
                  currentValues && currentValues.name
                    ? currentValues.name.length
                    : 0
                }/{CAMPAIGN_NAME_MAX_LENGTH}
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default compose(
  reduxForm({
    enableReinitialize: true,
  }),
  withReduxFormValues
)(Form);
