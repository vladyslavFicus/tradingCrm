import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import MultiCurrencyField from './MultiCurrencyField';
import { floatNormalize } from '../../../utils/inputNormalize';

class MultiCurrencyValue extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    baseCurrency: PropTypes.string,
    baseName: PropTypes.string,
    modals: PropTypes.shape({
      multiCurrencyModal: PropTypes.shape({
        show: PropTypes.func.isRequired,
        hide: PropTypes.func.isRequired,
      }),
    }).isRequired,
    label: PropTypes.string,
    optionCurrencies: PropTypes.shape({
      options: PropTypes.shape({
        signUp: PropTypes.shape({
          currency: PropTypes.shape({
            list: PropTypes.arrayOf(PropTypes.string),
          }),
        }),
      }),
    }),
    formValues: PropTypes.object.isRequired,
  };

  static defaultProps = {
    disabled: false,
    currencies: [],
    baseCurrency: '',
    baseName: 'amounts',
    label: 'Amount',
    optionCurrencies: { options: {}, loading: true },
  };

  static contextTypes = {
    _reduxForm: PropTypes.object,
  };

  get secondaryCurrencies() {
    const { optionCurrencies: { options } } = this.props;

    return get(options, 'signUp.post.currency.rates', []);
  }

  get baseCurrency() {
    const { optionCurrencies: { options } } = this.props;

    return get(options, 'signUp.post.currency.base', '');
  }

  get baseCurrencyValue() {
    return get(this.props.formValues, `${this.props.baseName}.amounts[0].amount`, 0);
  }

  get currencies() {
    return get(this.props.formValues, `${this.props.baseName}`, []);
  }

  setFields = (currencies) => {
    const { _reduxForm: { autofill } } = this.context;

    autofill(this.props.baseName, currencies);
  };

  handleChangeBaseCurrencyAmount = ({ target: { value } } = { target: { value: '' } }) => {
    const currencies = [];
    const baseCurrencyValue = value || this.baseCurrencyValue;

    currencies[0] = {
      amount: floatNormalize(value),
      currency: this.baseCurrency,
    };

    this.secondaryCurrencies.forEach(({ amount, currency }, index) => {
      currencies[index + 1] = {
        amount: floatNormalize(amount * baseCurrencyValue).toFixed(2),
        currency,
      };
    });

    this.setFields(currencies);
  };

  handleSubmitMultiCurrencyForm = (currencies) => {
    this.props.modals.multiCurrencyModal.hide();
    this.setFields(currencies);
  };

  handleOpenModal = () => {
    const {
      modals,
      label,
    } = this.props;
    const currencies = this.currencies;

    if (currencies.length <= 1) {
      this.handleChangeBaseCurrencyAmount();
    }

    modals.multiCurrencyModal.show({
      onSubmit: this.handleSubmitMultiCurrencyForm,
      label,
      initialValues: {
        amounts: this.currencies,
      },
    });
  };

  render() {
    const {
      baseName,
      baseCurrency,
      label,
      optionCurrencies: {
        loading,
      },
      disabled,
    } = this.props;

    return (
      <MultiCurrencyField
        name={`${baseName}[0]`}
        label={label}
        disabled={disabled || loading}
        currency={baseCurrency}
        onChange={this.handleChangeBaseCurrencyAmount}
        iconRightClassName="nas nas-currencies_icon"
        onIconClick={this.handleOpenModal}
      />
    );
  }
}

export default MultiCurrencyValue;
