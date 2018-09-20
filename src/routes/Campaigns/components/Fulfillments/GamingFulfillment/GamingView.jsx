import React, { PureComponent, Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import { Field } from 'redux-form';
import {
  SelectField,
  MultiCurrencyValue,
  NasSelectField,
  MultiInputField,
} from '../../../../../components/ReduxForm';
import PropTypes from '../../../../../constants/propTypes';
import renderLabel from '../../../../../utils/renderLabel';
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
    const { name, disabled } = this.props;

    return (
      <Fragment>
        <div className="row">
          <div className="col-4">
            <Field
              name={`${name}.aggregationType`}
              type="select"
              component={SelectField}
              disabled={disabled}
              label={I18n.t(attributeLabels.aggregationType)}
            >
              <option value="">{I18n.t('COMMON.SELECT_OPTION.DEFAULT')}</option>
              {Object.keys(aggregationTypes).map(key => (
                <option key={key} value={key}>
                  {renderLabel(key, aggregationTypeLabels)}
                </option>
              ))}
            </Field>
          </div>
          <div className="col-4">
            <Field
              name={`${name}.moneyType`}
              type="select"
              component={SelectField}
              disabled={disabled}
              label={I18n.t(attributeLabels.moneyType)}
            >
              <option value="">{I18n.t('COMMON.SELECT_OPTION.DEFAULT')}</option>
              {Object.keys(moneyTypes).map(key => (
                <option key={key} value={key}>
                  {renderLabel(key, moneyTypeLabels)}
                </option>
              ))}
            </Field>
          </div>
          <div className="col-4">
            <Field
              name={`${name}.spinType`}
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
        </div>
        <div className="row">
          <div className="col-4">
            <MultiCurrencyValue
              label={I18n.t(attributeLabels.amount)}
              baseName={`${name}.amount`}
              disabled={disabled}
            />
          </div>
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
