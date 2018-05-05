import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import MultiCurrencyField from './MultiCurrencyField';
import { floatNormalize } from '../../../utils/inputNormalize';
import MultiCurrencyTooltip from '../../../components/MultiCurrencyTooltip';

class MultiCurrencyValue extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    showErrorMessage: PropTypes.bool,
    baseCurrency: PropTypes.string,
    baseName: PropTypes.string,
    modals: PropTypes.shape({
      multiCurrencyModal: PropTypes.shape({
        show: PropTypes.func.isRequired,
        hide: PropTypes.func.isRequired,
      }),
    }).isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    optionCurrencies: PropTypes.shape({
      options: PropTypes.shape({
        signUp: PropTypes.shape({
          currency: PropTypes.shape({
            list: PropTypes.arrayOf(PropTypes.string),
          }),
        }),
      }),
    }),
    formValues: PropTypes.object,
    className: PropTypes.string,
    id: PropTypes.string,
  };

  static defaultProps = {
    disabled: false,
    showErrorMessage: true,
    formValues: {},
    baseCurrency: '',
    baseName: 'amounts',
    label: null,
    optionCurrencies: { options: {}, loading: true },
    id: null,
    className: null,
  };

  static contextTypes = {
    _reduxForm: PropTypes.object,
  };

  state = {
    isTooltipOpen: false,
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
      optionCurrencies: { options },
    } = this.props;
    const formCurrencies = this.currencies;
    const allCurrencies = get(options, 'signUp.post.currency.list', []);

    if (formCurrencies.length !== allCurrencies.length) {
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

  handleToggleTooltip = () => {
    this.setState({ isTooltipOpen: !this.state.isTooltipOpen });
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
      showErrorMessage,
      className,
      id,
    } = this.props;
    const { isTooltipOpen } = this.state;
    const rates = this.secondaryCurrencies;

    return (
      <div className={className}>
        <MultiCurrencyField
          name={`${baseName}[0]`}
          label={label}
          showErrorMessage={showErrorMessage}
          disabled={disabled || loading}
          currency={baseCurrency}
          onChange={this.handleChangeBaseCurrencyAmount}
          inputAddon={<i className="icon icon-currencies multi-currency-icon" />}
          inputAddonPosition="right"
          onIconClick={this.handleOpenModal}
          id={id}
        />
        <If condition={rates.length}>
          <MultiCurrencyTooltip
            id={`${id}-right-icon`}
            values={this.currencies}
            rates={this.secondaryCurrencies}
            isOpen={isTooltipOpen}
            toggle={this.handleToggleTooltip}
          />
        </If>
      </div>
    );
  }
}

export default MultiCurrencyValue;
