import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { Field, reduxForm } from 'redux-form';
import { createValidator } from '../../../../../../../utils/validator';
import { InputField } from '../../../../../../../components/ReduxForm';
import { floatNormalize } from '../../../../../../../utils/inputNormalize';

class Create extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    createEntity: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
    currencies: PropTypes.array,
    baseCurrency: PropTypes.string,
  };

  static defaultProps = {
    currencies: [],
    baseCurrency: '',
  };

  static contextTypes = {
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  handleSubmit = async (data) => {
    const action = await this.props.createEntity(data);

    if (action && !action.error) {
      this.context.router.push('/campaigns/fulfillments');
    }
  };

  handleChange = currency => (e) => {
    const { name, value } = e.target;
    const [fieldIndex] = name.split('.');

    const currencyField = `${fieldIndex}.currency`;
    const currencyValue = value ? currency : '';
    this.props.change(currencyField, currencyValue);
  };

  render() {
    const {
      handleSubmit,
      currencies,
      baseCurrency,
    } = this.props;

    return (
      <form
        className="form-horizontal campaign-settings"
        onSubmit={handleSubmit(this.handleSubmit)}
      >
        <div>
          {currencies.map((currency, index) => (
            <div
              key={currency}
              className="filter-row"
            >
              <Field
                name={`amounts[${index}].amount`}
                type="number"
                normalize={floatNormalize}
                label={baseCurrency === currency ? `${currency} (Base)` : currency}
                component={InputField}
                placeholder="0.0"
                position="vertical"
                onChange={this.handleChange(currency)}
              />
              <Field
                name={`amounts[${index}].currency`}
                hidden
                type="text"
                component="input"
              />
            </div>
          ))}
        </div>

        <button
          className="btn btn-primary text-uppercase"
          type="submit"
        >
          {I18n.t('CAMPAIGNS.WAGERING_FULFILLMENTS.ADD.ADD_BUTTON')}
        </button>

      </form>
    );
  }
}

export default reduxForm({
  form: 'createWageringFulfillment',
  validate: (values, { currencies }) => {
    const rules = {};

    currencies.forEach((_, i) => {
      rules[`amounts[${i}].amount`] = ['numeric', 'min: 0'];
    });

    return createValidator(rules, false)(values);
  },
})(Create);
