import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { createValidator, translateLabels } from 'utils/validator';
import renderLabel from 'utils/renderLabel';
import { FormikSelectField, FormikInputField } from 'components/Formik';
import { Button } from 'components/UI';
import {
  baseUnits,
  sortTypes,
  modalFieldsNames,
  MAX_MIGRATED_CLIENTS,
} from '../../constants';
import './AddSourceBrandModal.scss';

class AddSourceBrandModal extends PureComponent {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    allowedBaseUnits: PropTypes.arrayOf(PropTypes.string).isRequired,
    initialValues: PropTypes.shape({
      brand: PropTypes.string,
      distributionUnit: PropTypes.shape({
        quantity: PropTypes.number,
        baseUnit: PropTypes.string,
      }),
      sortType: PropTypes.string,
    }),
    fetchAvailableClientsAmount: PropTypes.func.isRequired,
    brands: PropTypes.arrayOf(PropTypes.brandConfig).isRequired,
  }

  static defaultProps = {
    initialValues: {},
  }

  state = {
    availableClientsAmount: null,
  }

  componentDidMount() {
    const {
      initialValues: { brand },
    } = this.props;

    if (brand) {
      this.fetchAvailableClientsAmount(brand);
    }
  }

  fetchAvailableClientsAmount = async (targetBrand) => {
    const {
      fetchAvailableClientsAmount,
    } = this.props;

    this.setState({ availableClientsAmount: null });

    try {
      const availableClientsAmount = await fetchAvailableClientsAmount(targetBrand);
      this.setState({ availableClientsAmount });
    } catch {
      // ...
    }
  };

  handleBrandChange = setFieldValue => (brand) => {
    setFieldValue('brand', brand);
    this.fetchAvailableClientsAmount(brand);
  };

  render() {
    const {
      onCloseModal,
      isOpen,
      handleSubmit,
      allowedBaseUnits,
      brands,
      initialValues: {
        brand,
        distributionUnit,
        sortType,
      },
    } = this.props;

    const { availableClientsAmount } = this.state;

    const { quantity, baseUnit } = distributionUnit || { baseUnit: allowedBaseUnits[0] };

    const limitAmount = Math.min(availableClientsAmount, MAX_MIGRATED_CLIENTS);

    return (
      <Modal
        toggle={onCloseModal}
        isOpen={isOpen}
        className="AddSourceBrandModal"
      >
        <Formik
          enableReinitialize
          initialValues={{
            brand,
            quantity,
            baseUnit,
            sortType: sortType || 'FIFO',
          }}
          validate={values => (
            createValidator({
              brand: 'required',
              quantity: ['required', 'integer', 'min:1',
                `max:${values.baseUnit === 'PERCENTAGE' ? 100 : limitAmount}`,
              ],
            }, translateLabels({
              ...modalFieldsNames,
              quantity: values.baseUnit === 'PERCENTAGE'
                ? modalFieldsNames.quantityPercentage
                : modalFieldsNames.quantity,
            }))(values)
          )}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <ModalHeader>{I18n.t('CLIENTS_DISTRIBUTION.RULE.SOURCE_BRAND')}</ModalHeader>
              <ModalBody>
                <Field
                  name="brand"
                  label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.SOURCE_BRAND')}
                  component={FormikSelectField}
                  customOnChange={this.handleBrandChange(setFieldValue)}
                  searchable
                >
                  {brands.map(_brand => (
                    <option key={_brand.brandId} value={_brand.brandId}>
                      {_brand.brandName}
                    </option>
                  ))}
                </Field>
                <If condition={values.brand}>
                  <div
                    className="AddSourceBrandModal__message"
                    dangerouslySetInnerHTML={{
                      __html: I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.AVAILABLE_CLIENTS_AMOUNT', {
                        value: typeof availableClientsAmount === 'number'
                          ? limitAmount
                          : '<span class="AddSourceBrandModal__message-spinner">...</span>',
                      }),
                    }}
                  />
                </If>
                <div className="AddSourceBrandModal__row">
                  <Field
                    name="quantity"
                    type="number"
                    label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.AMOUNT_MIGRATED_CLIENTS')}
                    step="1"
                    className="AddSourceBrandModal__field AddSourceBrandModal__field--quantity"
                    disabled={!availableClientsAmount}
                    component={FormikInputField}
                  />
                  <Field
                    name="baseUnit"
                    label="&nbsp;"
                    className="AddSourceBrandModal__field AddSourceBrandModal__field--unit"
                    component={FormikSelectField}
                    disabled={allowedBaseUnits.length === 1}
                  >
                    {allowedBaseUnits.map(value => (
                      <option key={value} value={value}>{baseUnits[value]}</option>
                    ))}
                  </Field>
                </div>
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
