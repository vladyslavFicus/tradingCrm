import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { createValidator } from 'utils/validator';
import PropTypes from 'constants/propTypes';
import { FormikSelectField, FormikInputField } from 'components/Formik';
import { Button } from 'components/UI';
import { brands, baseUnits } from '../../constants';
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
    initialValues: PropTypes.shape({
      brand: PropTypes.string,
      distributionUnit: PropTypes.shape({
        quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        baseUnit: PropTypes.string,
      }),
      operator: PropTypes.string,
    }),
  };

  static defaultProps = {
    initialValues: {},
  }

  render() {
    const {
      onCloseModal,
      isOpen,
      handleSubmit,
      operators,
      operatorsLoading,
      initialValues: {
        brand,
        distributionUnit,
        operator,
      },
    } = this.props;

    const { quantity, baseUnit } = distributionUnit || {};

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
          validate={createValidator({
            brand: 'required',
            quantity: 'required',
          })}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <ModalHeader>From brand</ModalHeader>
              <ModalBody>
                <Field
                  name="brand"
                  label="Brand"
                  component={FormikSelectField}
                  searchable
                >
                  {brands.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Field>
                <div className="AddTargetBrandModal__row--amount">
                  <Field
                    name="quantity"
                    type="number"
                    label="Amount of clients for migration"
                    step="1"
                    component={FormikInputField}
                    className="AddTargetBrandModal__field--amount"
                  />
                  <Field
                    name="baseUnit"
                    label="&nbsp;"
                    component={FormikSelectField}
                    className="AddTargetBrandModal__field--unit"
                  >
                    {baseUnits.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </Field>
                </div>
                <Field
                  name="operator"
                  label="Operator"
                  placeholder="Automatic operator"
                  component={FormikSelectField}
                  disabled={operatorsLoading || !operators.length}
                >
                  {operators.map(({ uuid, fullName }) => (
                    <option key={uuid} value={uuid}>{fullName}</option>
                  ))}
                </Field>
              </ModalBody>
              <ModalFooter className="AddTargetBrandModal__actions">
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
