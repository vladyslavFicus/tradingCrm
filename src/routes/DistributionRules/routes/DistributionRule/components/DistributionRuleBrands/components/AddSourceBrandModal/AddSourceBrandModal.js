import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { createValidator } from 'utils/validator';
import renderLabel from 'utils/renderLabel';
import { brandsConfig } from 'constants/brands';
import { FormikSelectField, FormikInputField } from 'components/Formik';
import { Button } from 'components/UI';
import { baseUnits, sortTypes } from '../../constants';
import './AddSourceBrandModal.scss';

class AddSourceBrandModal extends PureComponent {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    allowedBaseUnit: PropTypes.string.isRequired,
    initialValues: PropTypes.shape({
      brand: PropTypes.string,
      distributionUnit: PropTypes.shape({
        quantity: PropTypes.number,
        baseUnit: PropTypes.string,
      }),
      sortType: PropTypes.string,
    }),
    fetchAvailableClientsAmount: PropTypes.func.isRequired,
  }

  static defaultProps = {
    initialValues: {},
  }

  state = {
    availableClientsAmount: null,
  }

  async componentDidMount() {
    const {
      initialValues: { brand },
      fetchAvailableClientsAmount,
    } = this.props;

    if (brand) {
      const availableClientsAmount = await fetchAvailableClientsAmount(brand);
      this.setState({ availableClientsAmount });
    }
  }

  handleBrandChange = setFieldValue => async (brand) => {
    const {
      fetchAvailableClientsAmount,
    } = this.props;

    setFieldValue('brand', brand);

    const availableClientsAmount = await fetchAvailableClientsAmount(brand);
    this.setState({ availableClientsAmount });
  };

  render() {
    const {
      onCloseModal,
      isOpen,
      handleSubmit,
      allowedBaseUnit,
      initialValues: {
        brand,
        distributionUnit,
        sortType,
      },
    } = this.props;

    const { availableClientsAmount } = this.state;

    const { quantity, baseUnit } = distributionUnit || { baseUnit: allowedBaseUnit };

    return (
      <Modal
        toggle={onCloseModal}
        isOpen={isOpen}
        className="AddSourceBrandModal"
      >
        <Formik
          initialValues={{
            brand,
            quantity,
            baseUnit,
            sortType: sortType || 'FIFO',
          }}
          validate={createValidator({
            brand: 'required',
            quantity: 'required',
          })}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form>
              <ModalHeader>{I18n.t('CLIENTS_DISTRIBUTION.RULE.FROM_BRAND')}</ModalHeader>
              <ModalBody>
                <Field
                  name="brand"
                  label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.SOURCE_BRAND')}
                  component={FormikSelectField}
                  customOnChange={this.handleBrandChange(setFieldValue)}
                  searchable
                >
                  {Object.keys(brandsConfig).map(value => (
                    <option key={value} value={value}>{brandsConfig[value].name}</option>
                  ))}
                </Field>
                <If condition={typeof availableClientsAmount === 'number'}>
                  <div className="AddSourceBrandModal__message">
                    {I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.AVAILABLE_CLIENTS_AMOUNT', {
                      value: availableClientsAmount,
                    })}
                  </div>
                </If>
                <Field
                  name="quantity"
                  type="number"
                  label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.AMOUNT_MIGRATED_CLIENTS')}
                  step="1"
                  addition={baseUnits[baseUnit]}
                  additionPosition="right"
                  component={FormikInputField}
                />
                <Field
                  name="sortType"
                  label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.SORT_METHOD')}
                  component={FormikSelectField}
                >
                  {Object.keys(sortTypes).map(value => (
                    <option key={value} value={value}>{renderLabel(value, sortTypes)}</option>
                  ))}
                </Field>
              </ModalBody>
              <ModalFooter>
                <Button
                  commonOutline
                  onClick={onCloseModal}
                >
                  {I18n.t('COMMON.CANCEL')}
                </Button>
                <Button
                  type="submit"
                  primary
                >
                  {I18n.t('COMMON.CONFIRM')}
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
    );
  }
}

export default AddSourceBrandModal;
