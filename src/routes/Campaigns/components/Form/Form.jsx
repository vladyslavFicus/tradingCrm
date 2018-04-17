import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { InputField } from '../../../../components/ReduxForm';
import {
  attributeLabels,
  rewardTemplateTypes,
  rewardTypesLabels,
  fulfilmentTypes,
  fulfilmentTypesLabels,
} from '../../constants';
import NodeBuilder from '../NodeBuilder';
import { BonusView } from '../Bonus';
import { FreeSpinView } from '../FreeSpin';
import { WageringView } from '../Wagering';
import { createValidator } from '../../../../utils/validator';
import Permissions from '../../../../utils/permissions';
import permissions from '../../../../config/permissions';
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

  static contextTypes = {
    permissions: PropTypes.array.isRequired,
  };

  componentWillReceiveProps({ disabled }) {
    if (disabled && !this.props.disabled) {
      this.props.reset();
    }
  }

  getAllowedNodes = (items, prefix = '') => {
    const { permissions: currentPermissions } = this.context;

    return items.filter(({ type }) =>
      new Permissions(permissions[`${type}${prefix}`].CREATE &&
       permissions[`${type}${prefix}`].VIEW).check(currentPermissions))
      .reduce((acc, { type, component }) => ({ ...acc, [type]: component }), {});
  };

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
      <form id={form} onSubmit={handleSubmit(onSubmit)} className="container-fluid campaigns-form">
        <div className="row">
          <div className="col-auto campaigns-form__title">
            {I18n.t('BONUS_CAMPAIGNS.SETTINGS.CAMPAIGN_SETTINGS')}
          </div>
          <If condition={!pristine}>
            <div className="col-auto ml-auto">
              <button
                disabled={submitting}
                onClick={reset}
                className="btn btn-default-outline text-uppercase mr-3"
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
          </If>
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
        <div className="row mt-2">
          <NodeBuilder
            name="fulfillments"
            disabled={disabled}
            className="col-6"
            nodeSelectLabel="CAMPAIGNS.SELECT_FULFILLMENT"
            nodeButtonLabel="CAMPAIGNS.ADD_FULFILLMENT"
            components={
              this.getAllowedNodes([
                { type: fulfilmentTypes.WAGERING, component: WageringView },
              ], '_FULFILLMENT')
            }
            typeLabels={fulfilmentTypesLabels}
          />
          <NodeBuilder
            name="rewards"
            disabled={disabled}
            className="col-6"
            nodeSelectLabel="CAMPAIGNS.SELECT_REWARD"
            nodeButtonLabel="CAMPAIGNS.ADD_REWARD"
            components={
              this.getAllowedNodes([
                { type: rewardTemplateTypes.BONUS, component: BonusView },
                { type: rewardTemplateTypes.FREE_SPIN, component: FreeSpinView },
              ], '_TEMPLATE')
            }
            typeLabels={rewardTypesLabels}
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
