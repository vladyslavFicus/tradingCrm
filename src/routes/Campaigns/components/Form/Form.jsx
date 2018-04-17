import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import moment from 'moment';
import { Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { get, isEqual } from 'lodash';
import { InputField, DateTimeField } from '../../../../components/ReduxForm';
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
import DepositFulfillmentView from '../DepositFulfillmentView';
import { createValidator } from '../../../../utils/validator';
import Permissions from '../../../../utils/permissions';
import permissions from '../../../../config/permissions';
import './Form.scss';
import { withReduxFormValues } from '../../../../components/HighOrder';

const CAMPAIGN_NAME_MAX_LENGTH = 100;

class Form extends Component {
  static propTypes = {
    change: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    form: PropTypes.string.isRequired,
    formValues: PropTypes.shape({
      name: PropTypes.string,
    }),
    disabled: PropTypes.bool,
  };
  static contextTypes = {
    permissions: PropTypes.array.isRequired,
  };
  static defaultProps = {
    disabled: false,
    handleSubmit: null,
    pristine: false,
    submitting: false,
    formValues: {},
  };

  componentWillReceiveProps({ disabled: nextDisabled, formValues: nextFormValues }) {
    const { disabled, formValues, change } = this.props;

    if (!isEqual(formValues.fulfillments, nextFormValues.fulfillments)) {
      nextFormValues.fulfillments.forEach((fulfillment, index) => {
        if (fulfillment.uuid) {
          const prevFulfillment = formValues.fulfillments[index];
          const isSameObject = (
            !!prevFulfillment && Object.keys(prevFulfillment).length === Object.keys(fulfillment).length
          );

          if (isSameObject && !isEqual(prevFulfillment, fulfillment)) {
            change(`fulfillments[${index}].uuid`, null);
          }
        }
      });
    }

    if (nextDisabled && !disabled) {
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

  endDateValidator = fromAttribute => (current) => {
    const { formValues } = this.props;

    return formValues && current.isSameOrAfter(moment().subtract(1, 'd')) && (
      formValues[fromAttribute]
        ? current.isSameOrAfter(moment(formValues[fromAttribute]))
        : true
    );
  };

  render() {
    const {
      handleSubmit,
      onSubmit,
      pristine,
      submitting,
      formValues,
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
          <div className="col-md-6">
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
                formValues && formValues.name
                  ? formValues.name.length
                  : 0
              }/{CAMPAIGN_NAME_MAX_LENGTH}
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label>{I18n.t('CAMPAIGNS.SETTINGS.LABEL.CAMPAIGN_PERIOD')}</label>
              <div className="range-group">
                <Field
                  utc
                  name="startDate"
                  component={DateTimeField}
                  isValidDate={() => true}
                  position="vertical"
                  disabled={disabled}
                />
                <span className="range-group__separator">-</span>
                <Field
                  utc
                  name="endDate"
                  component={DateTimeField}
                  isValidDate={this.endDateValidator('startDate')}
                  position="vertical"
                  disabled={disabled}
                />
              </div>
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
                { type: fulfilmentTypes.DEPOSIT, component: DepositFulfillmentView },
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

export default compose(
  reduxForm({
    enableReinitialize: true,
    validate: (values) => {
      const rules = {
        name: ['required', 'string'],
      };

      const fulfillments = get(values, 'fulfillments', []);

      if (fulfillments.length > 0) {
        rules.fulfillments = {};
      }

      fulfillments.forEach((fulfillment, index) => {
        if (fulfillment.type === fulfilmentTypes.DEPOSIT) {
          rules.fulfillments[index] = {
            numDeposit: ['required'],
          };
        }
      });

      return createValidator(rules, attributeLabels, false)(values);
    },
  }),
  withReduxFormValues,
)(Form);
