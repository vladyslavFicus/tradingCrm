import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import moment from 'moment';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import { InputField, SelectField, DateTimeField, RangeGroup } from '../../../../components/ReduxForm';
import {
  nodeGroups,
  nodeGroupsAlias,
  nodeGroupValidateMessage,
  attributeLabels,
  rewardTemplateTypes,
  rewardTypesLabels,
  fulfillmentTypes,
  fulfillmentTypesLabels,
  optInSelect,
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
import { withReduxFormValues, withNotifications } from '../../../../components/HighOrder';
import renderLabel from '../../../../utils/renderLabel';
import normalizeBoolean from '../../../../utils/normalizeBoolean';

const CAMPAIGN_NAME_MAX_LENGTH = 100;

class Form extends Component {
  static propTypes = {
    reset: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
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

  componentWillReceiveProps({ disabled: nextDisabled }) {
    const { reset, disabled } = this.props;

    if (nextDisabled && !disabled) {
      reset();
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

  handleSubmit = (formData) => {
    let valid = true;

    [nodeGroups.REWARDS].forEach((nodeGroup) => {
      if (!formData[nodeGroupsAlias[nodeGroup]].length) {
        this.props.notify({
          level: 'error',
          title: I18n.t(nodeGroupValidateMessage[nodeGroup]),
        });
        valid = false;
      }
    });

    if (!valid) {
      throw new SubmissionError({});
    }

    return this.props.onSubmit(formData);
  };

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      formValues,
      form,
      reset,
      disabled,
    } = this.props;

    return (
      <form id={form} onSubmit={handleSubmit(this.handleSubmit)} className="container-fluid campaigns-form">
        <div className="row">
          <div className="col-auto campaigns-form__title">
            {I18n.t('CAMPAIGNS.SETTINGS.CAMPAIGN_SETTINGS')}
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
              helpText={
                <Choose>
                  <When condition={formValues && formValues.name}>
                    {formValues.name.length}/{CAMPAIGN_NAME_MAX_LENGTH}
                  </When>
                  <Otherwise>
                    0/{CAMPAIGN_NAME_MAX_LENGTH}
                  </Otherwise>
                </Choose>
              }
            />
          </div>
          <RangeGroup
            className="col-md-4"
            label={I18n.t('CAMPAIGNS.SETTINGS.LABEL.CAMPAIGN_PERIOD')}
          >
            <Field
              utc
              name="startDate"
              component={DateTimeField}
              isValidDate={() => true}
              position="vertical"
              disabled={disabled}
              id="campaign-start-date"
            />
            <Field
              utc
              name="endDate"
              component={DateTimeField}
              isValidDate={this.endDateValidator('startDate')}
              position="vertical"
              disabled={disabled}
              id="campaign-end-date"
            />
          </RangeGroup>
        </div>
        <div className="row">
          <div className="col-3">
            <Field
              name="optIn"
              label={I18n.t('CAMPAIGNS.SETTINGS.LABEL.OPT_IN')}
              type="select"
              id="campaign-opt-in"
              component={SelectField}
              normalize={normalizeBoolean}
              position="vertical"
              disabled={disabled}
            >
              {Object.keys(optInSelect).map(key => (
                <option key={key} value={key}>
                  {renderLabel(key, optInSelect)}
                </option>
              ))}
            </Field>
          </div>
        </div>
        <div className="row mt-2">
          <NodeBuilder
            name="fulfillments"
            disabled={disabled}
            className="col-6"
            nodeSelectLabel={I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.SELECT_FULFILLMENT')}
            nodeButtonLabel={I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.ADD_FULFILLMENT')}
            components={
              this.getAllowedNodes([
                { type: fulfillmentTypes.WAGERING, component: WageringView },
                { type: fulfillmentTypes.DEPOSIT, component: DepositFulfillmentView },
              ], '_FULFILLMENT')
            }
            typeLabels={fulfillmentTypesLabels}
          />
          <NodeBuilder
            name="rewards"
            disabled={disabled}
            className="col-6"
            nodeSelectLabel={I18n.t('CAMPAIGNS.SETTINGS.REWARDS.SELECT_REWARD')}
            nodeButtonLabel={I18n.t('CAMPAIGNS.SETTINGS.REWARDS.ADD_REWARD')}
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
  withNotifications,
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
        if (fulfillment.type === fulfillmentTypes.DEPOSIT) {
          rules.fulfillments[index] = {
            numDeposit: ['required'],
            'minAmount[0].amount': ['numeric', 'min:1'],
            'maxAmount[0].amount': ['numeric', 'min:1', `greaterOrSame:fulfillments[${index}].minAmount[0].amount`],
          };
        }

        if (fulfillment.type === fulfillmentTypes.WAGERING) {
          rules.fulfillments[index] = {
            'amounts[0].amount': ['required', 'numeric', 'greater:0'],
          };
        }
      });

      return createValidator(rules, attributeLabels, false)(values);
    },
  }),
  withReduxFormValues,
)(Form);
