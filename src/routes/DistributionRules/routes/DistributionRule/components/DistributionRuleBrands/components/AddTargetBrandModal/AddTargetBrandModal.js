import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { createValidator, translateLabels } from 'utils/validator';
import { brandsConfig } from 'constants/brands';
import PropTypes from 'constants/propTypes';
import { FormikSelectField, FormikInputField } from 'components/Formik';
import { Button } from 'components/UI';
import { baseUnits, modalFieldsNames } from '../../constants';
import './AddTargetBrandModal.scss';

class AddTargetBrandModal extends PureComponent {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    operators: PropTypes.arrayOf(PropTypes.shape({
      uuid: PropTypes.string,
      fullName: PropTypes.string,
    })).isRequired,
    operatorsLoading: PropTypes.bool.isRequired,
    sourceBrand: PropTypes.string.isRequired,
    allowedBaseUnits: PropTypes.arrayOf(PropTypes.string).isRequired,
    initialValues: PropTypes.shape({
      brand: PropTypes.string,
      distributionUnit: PropTypes.shape({
        quantity: PropTypes.number,
        baseUnit: PropTypes.string,
      }),
      operator: PropTypes.string,
    }),
    fetchAvailableClientsAmount: PropTypes.func.isRequired,
  };

  static defaultProps = {
    initialValues: {},
  }

  state = {
    availableClientsAmount: null,
  }

  async componentDidMount() {
    const {
      sourceBrand,
      initialValues: { brand: targetBrand },
      fetchAvailableClientsAmount,
    } = this.props;

    if (targetBrand) {
      const availableClientsAmount = await fetchAvailableClientsAmount(sourceBrand, targetBrand);
      this.setState({ availableClientsAmount });
    }
  }

  handleBrandChange = setFieldValue => async (targetBrand) => {
    const {
      sourceBrand,
      fetchAvailableClientsAmount,
    } = this.props;

    setFieldValue('brand', targetBrand);

    const availableClientsAmount = await fetchAvailableClientsAmount(sourceBrand, targetBrand);
    this.setState({ availableClientsAmount });
  };

  render() {
    const {
      onCloseModal,
      isOpen,
      handleSubmit,
      operators,
      operatorsLoading,
      allowedBaseUnits,
      initialValues: {
        brand,
        distributionUnit,
        operator,
      },
    } = this.props;

    const { availableClientsAmount } = this.state;

    const { quantity, baseUnit } = distributionUnit || { baseUnit: allowedBaseUnits[0] };

    return (
      <Modal
        toggle={onCloseModal}
        isOpen={isOpen}
        className="AddTargetBrandModal"
      >
        <Formik
          initialValues={{
            brand,
            quantity,
            baseUnit,
            operator,
          }}
          validate={values => (
            createValidator({
              brand: 'required',
              quantity: ['required', 'integer', values.baseUnit === 'PERCENTAGE' ? 'between:1,100' : 'min:1'],
            }, translateLabels(modalFieldsNames))(values)
          )}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form>
              <ModalHeader>{I18n.t('CLIENTS_DISTRIBUTION.RULE.TO_BRAND')}</ModalHeader>
              <ModalBody>
                <Field
                  name="brand"
                  label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.TARGET_BRAND')}
                  component={FormikSelectField}
                  customOnChange={this.handleBrandChange(setFieldValue)}
                  searchable
                >
                  {Object.keys(brandsConfig).map(value => (
                    <option key={value} value={value}>{brandsConfig[value].name}</option>
                  ))}
                </Field>
                <If condition={typeof availableClientsAmount === 'number'}>
                  <div className="AddTargetBrandModal__message">
                    {I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.AVAILABLE_CLIENTS_AMOUNT', {
                      value: availableClientsAmount,
                    })}
                  </div>
                </If>
                <div className="AddTargetBrandModal__row">
                  <Field
                    name="quantity"
                    type="number"
                    label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.AMOUNT_MIGRATED_CLIENTS')}
                    step="1"
                    className="AddTargetBrandModal__field AddTargetBrandModal__field--quantity"
                    component={FormikInputField}
                  />
                  <Field
                    name="baseUnit"
                    label="&nbsp;"
                    className="AddTargetBrandModal__field AddTargetBrandModal__field--unit"
                    component={FormikSelectField}
                    disabled={allowedBaseUnits.length === 1}
                  >
                    {allowedBaseUnits.map(value => (
                      <option key={value} value={value}>{baseUnits[value]}</option>
                    ))}
                  </Field>
                </div>
                <Field
                  name="operator"
                  label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.OPERATOR')}
                  placeholder={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.AUTO_OPERATOR')}
                  component={FormikSelectField}
                  disabled={operatorsLoading || !operators.length}
                >
                  {operators.map(({ uuid, fullName }) => (
                    <option key={uuid} value={uuid}>{fullName}</option>
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

export default AddTargetBrandModal;
