import React, { PureComponent, Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import { Field } from 'redux-form';
import {
  SelectField,
  MultiCurrencyValue,
  NasSelectField,
  MultiInputField,
  InputField,
} from '../../../../../components/ReduxForm';
import PropTypes from '../../../../../constants/propTypes';
import renderLabel from '../../../../../utils/renderLabel';
import { intNormalize } from '../../../../../utils/inputNormalize';
import {
  attributeLabels,
  aggregationTypes,
  aggregationTypeLabels,
  moneyTypes,
  moneyTypeLabels,
  spinTypes,
  spinTypeLabels,
  gameFilters,
  gameFilterLabels,
} from './constants';

class GamingView extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    formValues: PropTypes.object.isRequired,
    gameProviders: PropTypes.shape({
      gameProviders: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
  };

  static contextTypes = {
    _reduxForm: PropTypes.object,
  };

  get isProviderGameFilter() {
    const { formValues, name } = this.props;

    const currentValues = get(formValues, name, {});

    return currentValues.gameFilter && currentValues.gameFilter === gameFilters.PROVIDER;
  }

  get isCustomGameFilter() {
    const { formValues, name } = this.props;

    const currentValues = get(formValues, name, {});

    return currentValues.gameFilter && currentValues.gameFilter === gameFilters.CUSTOM;
  }

  handleChangeGameFilter = () => {
    const { name } = this.props;
    const { _reduxForm: { autofill } } = this.context;

    autofill(`${name}.gameList`, null);
  };

  handleChangeAggregationType = (_, value) => {
    const { name } = this.props;
    const { _reduxForm: { autofill } } = this.context;

    if (value === aggregationTypes.COUNT) {
      autofill(`${name}.amountSum`, null);
    } else if (value === aggregationTypes.SUM) {
      autofill(`${name}.amountCount`, null);
      autofill(`${name}.amountSum`, []);
    }
  };

  renderGameList() {
    const { name, disabled, gameProviders } = this.props;

    const availableGameProviders = get(gameProviders, 'gameProviders', []);

    return (
      <Fragment>
        <If condition={this.isProviderGameFilter}>
          <Field
            name={`${name}.gameList`}
            label={I18n.t(attributeLabels.gameList)}
            component={NasSelectField}
            multiple
            disabled={disabled}
            className="col-5"
          >
            {availableGameProviders.map(key => (
              <option key={key} value={key}>{key}</option>
            ))}
          </Field>
        </If>
        <If condition={this.isCustomGameFilter}>
          <Field
            name={`${name}.gameList`}
            label={I18n.t(attributeLabels.gameList)}
            component={MultiInputField}
            multiple
            disabled={disabled}
            className="col-5"
          />
        </If>
      </Fragment>
    );
  }

  render() {
    const { name, disabled, formValues } = this.props;

    const aggregationType = get(formValues, `${name}.aggregationType`);

    return (
      <Fragment>
        <div className="row">
          <Field
            name={`${name}.aggregationType`}
            className="col-4"
            type="select"
            component={SelectField}
            disabled={disabled}
            label={I18n.t(attributeLabels.aggregationType)}
            onChange={this.handleChangeAggregationType}
          >
            <option value="">{I18n.t('COMMON.SELECT_OPTION.DEFAULT')}</option>
            {Object.keys(aggregationTypes).map(key => (
              <option key={key} value={key}>
                {renderLabel(key, aggregationTypeLabels)}
              </option>
            ))}
          </Field>
          <Choose>
            <When condition={aggregationType === aggregationTypes.COUNT}>
              <Field
                name={`${name}.amountCount`}
                type="number"
                className="col-4"
                label={I18n.t(attributeLabels.amount)}
                component={InputField}
                disabled={disabled}
                normalize={intNormalize}
              />
            </When>
            <When condition={aggregationType === aggregationTypes.SUM}>
              <MultiCurrencyValue
                baseName={`${name}.amountSum`}
                showErrorMessage={false}
                className="col-4"
                label={I18n.t(attributeLabels.amount)}
                disabled={disabled}
              />
            </When>
          </Choose>
          <Field
            name={`${name}.spinType`}
            className="col-4"
            type="select"
            component={SelectField}
            disabled={disabled}
            label={I18n.t(attributeLabels.spinType)}
          >
            <option value="">{I18n.t('COMMON.SELECT_OPTION.DEFAULT')}</option>
            {Object.keys(spinTypes).map(key => (
              <option key={key} value={key}>
                {renderLabel(key, spinTypeLabels)}
              </option>
            ))}
          </Field>
        </div>
        <div className="row">
          <Field
            name={`${name}.moneyType`}
            type="select"
            className="col-4"
            component={SelectField}
            disabled={disabled || !aggregationType}
            label={I18n.t(attributeLabels.moneyType)}
          >
            <option value="">{I18n.t('COMMON.SELECT_OPTION.DEFAULT')}</option>
            {Object.keys(moneyTypes).map(key => (
              <option key={key} value={key}>
                {renderLabel(key, moneyTypeLabels)}
              </option>
            ))}
          </Field>
          <Field
            name={`${name}.gameFilter`}
            type="select"
            component={SelectField}
            disabled={disabled}
            label={I18n.t(attributeLabels.gameFilter)}
            className="col-3"
            onChange={this.handleChangeGameFilter}
          >
            <option value="">{I18n.t('COMMON.SELECT_OPTION.DEFAULT')}</option>
            {Object.keys(gameFilters).map(key => (
              <option key={key} value={key}>
                {renderLabel(key, gameFilterLabels)}
              </option>
            ))}
          </Field>
          {this.renderGameList()}
        </div>
      </Fragment>
    );
  }
}

export default GamingView;
