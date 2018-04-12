import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { createValidator } from '../../../utils/validator';
import MultiCurrencyField from './MultiCurrencyField';

class MultiCurrencyModal extends PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    baseCurrency: PropTypes.string.isRequired,
  };

  handleChange = (currency, index) => ({ target: { value } }) => {
    const currencyFieldName = `amounts[${index}].currency`;
    const currencyCode = value ? currency : '';

    this.props.change(currencyFieldName, currencyCode);
  };

  handleSubmit = ({ amounts }) => {
    this.props.onSubmit(amounts);
  };

  renderField = (currency, index = 0) => (
    <MultiCurrencyField
      name={`amounts[${index}]`}
      currency={currency}
      onChange={this.handleChange(currency, index)}
    />
  );

  render() {
    const {
      handleSubmit,
      onCloseModal,
      isOpen,
      currencies,
      baseCurrency,
    } = this.props;

    return (
      <Modal toggle={onCloseModal} isOpen={isOpen}>
        <ModalHeader toggle={onCloseModal}>
          Value in different currencies
        </ModalHeader>

        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <ModalBody>
            <div>
              { this.renderField(baseCurrency) }
              {currencies.map((currency, index) => this.renderField(currency, index + 1))}
            </div>
          </ModalBody>

          <ModalFooter>
            <div className="row">
              <div className="col-7">
                <button
                  type="submit"
                  className="btn btn-primary ml-2"
                  id="create-new-operator-submit-button"
                >
                  Submit
                </button>
              </div>
            </div>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default reduxForm({
  enableReinitialize: true,
  form: 'multiCurrencyModal',
  validate: (values, { currencies }) => {
    const rules = {};

    currencies.forEach((_, i) => {
      rules[`amounts[${i}].amount`] = ['numeric', 'min: 0'];
    });

    return createValidator(rules, false)(values);
  },
})(MultiCurrencyModal);
