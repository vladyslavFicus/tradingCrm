import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import attributeLabels from './constants';
import './CurrencyCalculationModal.scss';

const CurrencyCalculationModal = ({ onHide, handleSubmit }) => (
  <Modal isOpen toggle={onHide} className="currency-calc-modal">
    <form>
      <ModalHeader toggle={onHide}>
        <i className="nas nas-currencies_icon" />
        <span className="currency-calc-modal-header">{I18n.t(attributeLabels.header)}</span>
      </ModalHeader>
      <ModalBody>
        <div className="currency-calc-modal__input">
          <div className="currency-calc-modal__input-label">
            {I18n.t(attributeLabels.minDeposit)}
          </div>
          <div className="currency-calc-modal__input-wrapper">
            <div className="currency-calc-modal__input-currency">
              EUR
            </div>
            <div className="currency-calc-modal__input-input">
              <input type="text" value="20,00" className="form-control" />
            </div>
            <div className="currency-calc-modal__input-button">
              <button className="btn btn-primary-outline">
                {I18n.t(attributeLabels.recalc)}
              </button>
              <div className="currency-calc-modal__input-warning">
                {I18n.t(attributeLabels.recalcWarning)}
              </div>
            </div>
          </div>
        </div>
        <div className="currency-calc-modal__output">
          <table className="table table-responsive">
            <thead>
              <tr>
                <th className="currency-calc-modal__output-header">{I18n.t(attributeLabels.currency)}</th>
                <th className="currency-calc-modal__output-header">{I18n.t(attributeLabels.rate)}</th>
                <th className="currency-calc-modal__output-header">{I18n.t(attributeLabels.calculated)}</th>
                <th className="currency-calc-modal__output-header">{I18n.t(attributeLabels.customized)}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="currency-calc-modal__output-content"><b>RUB</b></td>
                <td className="currency-calc-modal__output-content">62,500</td>
                <td className="currency-calc-modal__output-content">6230,00</td>
                <td><input className="form-control" type="text" placeholder="6230,00" /></td>
              </tr>
              <tr>
                <td className="currency-calc-modal__output-content"><b>USD</b></td>
                <td className="currency-calc-modal__output-content">1,150</td>
                <td className="currency-calc-modal__output-content">1150,00</td>
                <td><input className="form-control" type="text" value="1000,00" /></td>
              </tr>
              <tr>
                <td className="currency-calc-modal__output-content"><b>UAH</b></td>
                <td className="currency-calc-modal__output-content">29,450</td>
                <td className="currency-calc-modal__output-content">2945,00</td>
                <td><input className="form-control" type="text" value="3000,00" /></td>
              </tr>
              <tr>
                <td className="currency-calc-modal__output-content"><b>GBP</b></td>
                <td className="currency-calc-modal__output-content">0,953</td>
                <td className="currency-calc-modal__output-content">943,00</td>
                <td><input className="form-control" type="text" value="950,00" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-default-outline margin-right-10" onClick={onHide}>
          {I18n.t('COMMON.BUTTONS.CANCEL')}
        </button>
        <button className="btn btn-primary" type="submit">
          {I18n.t('COMMON.BUTTONS.CONFIRM')}
        </button>
      </ModalFooter>
    </form>
  </Modal>
);

CurrencyCalculationModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func,
};

CurrencyCalculationModal.defaultProps = {
  handleSubmit: null,
};

export default CurrencyCalculationModal;
