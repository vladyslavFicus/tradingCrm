import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { InputField } from '../../../../components/ReduxForm';
import {
  attributeLabels,
  rewardTypes,
  rewardTypesLabels,
  fulfilmentTypes,
  fulfilmentTypesLabels,
} from '../../constants';
import NodeBuilder from '../NodeBuilder';
import { BonusView } from '../Bonus';
import { FreeSpinView } from '../FreeSpin';
import { WageringView } from '../Wagering';
import { createValidator } from '../../../../utils/validator';
import './Form.scss';

const CAMPAIGN_NAME_MAX_LENGTH = 100;

class Form extends Component {
  static propTypes = {
    reset: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    form: PropTypes.string.isRequired,
    currentValues: PropTypes.shape({
      name: PropTypes.string,
    }),
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
    handleSubmit: null,
    pristine: false,
    submitting: false,
    currentValues: {},
  };

  componentWillReceiveProps({ disabled }) {
    if (disabled && !this.props.disabled) {
      this.props.reset();
    }
  }

  render() {
    const {
      handleSubmit,
      onSubmit,
      pristine,
      submitting,
      currentValues,
      form,
      reset,
      disabled,
    } = this.props;

    return (
      <form id={form} onSubmit={handleSubmit(onSubmit)} className="campaign-settings">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-6 text-truncate campaign-settings__title">
              {I18n.t('BONUS_CAMPAIGNS.SETTINGS.CAMPAIGN_SETTINGS')}
            </div>
            {
              !pristine &&
              <div className="col-md-6 text-md-right">
                <button
                  disabled={submitting}
                  onClick={reset}
                  className="btn btn-default-outline text-uppercase margin-right-20"
                  type="button"
                >
                  {I18n.t('COMMON.REVERT_CHANGES')}
                </button>
                <button
                  disabled={submitting}
                  className="btn btn-primary text-uppercase"
                  type="submit"
                  id="bonus-campaign-save-button"
                >
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
                disabled={disabled || submitting}
                label={I18n.t(attributeLabels.campaignName)}
                type="text"
                component={InputField}
                position="vertical"
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
        <div className="row">
          <NodeBuilder
            name="fulfillments"
            disabled={disabled}
            className="col-6"
            components={{
              [fulfilmentTypes.WAGERING]: WageringView,
            }}
            typeLabels={fulfilmentTypesLabels}
            types={Object.keys(fulfilmentTypes)}
          />
          <NodeBuilder
            name="rewards"
            disabled={disabled}
            className="col-6"
            components={{
              [rewardTypes.BONUS]: BonusView,
              [rewardTypes.FREE_SPIN]: FreeSpinView,
            }}
            typeLabels={rewardTypesLabels}
            types={Object.keys(rewardTypes)}
          />
        </div>
      </form>
    );
  }
}

export default reduxForm({
  enableReinitialize: true,
  validate: createValidator({
    name: ['required', 'string'],
  }, attributeLabels, false),
})(Form);
