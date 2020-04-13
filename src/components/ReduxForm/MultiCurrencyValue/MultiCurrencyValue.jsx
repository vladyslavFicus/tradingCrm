import React, { Component } from 'react';
import { v4 } from 'uuid';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import MultiCurrencyField from './MultiCurrencyField';
import { floatNormalize } from '../../../utils/inputNormalize';
import MultiCurrencyTooltip from '../../MultiCurrencyTooltip';

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
    change: PropTypes.func.isRequired,
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

  static contextTypes = {
    _reduxForm: PropTypes.object,
  };

  static defaultProps = {
    id: null,
    disabled: false,
    showErrorMessage: true,
    formValues: {},
    baseCurrency: '',
    baseName: 'amounts',
    label: null,
    optionCurrencies: { options: {}, loading: true },
    className: null,
  };

  id = this.props.id ? this.props.id.replace(/[[\]]/g, '') : v4().replace(/[0-9]/g, '');

  state = {
    isTooltipOpen: false,
  };

  componentWillReceiveProps({ optionCurrencies: { options: nextOptions, loading: nextOptionsLoading } }) {
    const formCurrencies = this.currencies;
    const allCurrencies = get(nextOptions, 'signUp.post.currency.list', []);

    if (!nextOptionsLoading && this.baseCurrencyValue && formCurrencies.length !== allCurrencies.length) {
      this.handleUpdateBaseCurrencyAmount();
    }
  }

  get secondaryCurrencies() {
    const { optionCurrencies: { options } } = this.props;

    return get(options, 'signUp.post.currency.rates', []);
  }

  get baseCurrency() {
    const { optionCurrencies: { options } } = this.props;

    return get(options, 'signUp.post.currency.base', '');
  }

  get baseCurrencyValue() {
    return get(this.props.formValues, `${this.props.baseName}[0].amount`, 0);
  }

  get currencies() {
    return get(this.props.formValues, `${this.props.baseName}`, []);
  }

  setFields = (currencies) => {
    const { change } = this.props;

    change(this.props.baseName, currencies);
  };

  calculateCurrencies = (value) => {
    const currencies = [];

    if (value || value === 0) {
      currencies[0] = {
        amount: floatNormalize(value),
        currency: this.baseCurrency,
      };

      this.secondaryCurrencies.forEach(({ amount, currency }, index) => {
        currencies[index + 1] = {
          amount: floatNormalize(amount * value).toFixed(4),
          currency,
        };
      });
    }

    return currencies;
  };

  handleUpdateBaseCurrencyAmount = () => {
    const currencies = this.calculateCurrencies(this.baseCurrencyValue);

    this.setFields(currencies);
  };

  handleChangeBaseCurrencyAmount = ({ target: { value }, preventDefault: _preventDefault }) => {
    _preventDefault();
    const currencies = this.calculateCurrencies(value);

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
      this.handleUpdateBaseCurrencyAmount();
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
    this.setState(({ isTooltipOpen }) => ({ isTooltipOpen: !isTooltipOpen }));
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
          onBlur={e => e.preventDefault()}
          onChange={this.handleChangeBaseCurrencyAmount}
          inputAddon={<i className="icon icon-currencies multi-currency-icon" />}
          inputAddonPosition="right"
          onIconClick={disabled ? null : this.handleOpenModal}
          id={this.id}
        />
        <If condition={rates.length}>
          <MultiCurrencyTooltip
            id={`${this.id}-right-icon`}
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
