import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { createValidator } from 'utils/validator';
import { brandsConfig } from 'constants/brands';
import PropTypes from 'constants/propTypes';
import { FormikSelectField, FormikInputField } from 'components/Formik';
import { Button } from 'components/UI';
import { baseUnits } from '../../constants';

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
    allowedBaseUnit: PropTypes.string.isRequired,
    initialValues: PropTypes.shape({
      brand: PropTypes.string,
      distributionUnit: PropTypes.shape({
        quantity: PropTypes.number,
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
      allowedBaseUnit,
      initialValues: {
        brand,
        distributionUnit,
        operator,
      },
    } = this.props;

    const { quantity, baseUnit } = distributionUnit || { baseUnit: allowedBaseUnit };

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
              <ModalHeader>{I18n.t('CLIENTS_DISTRIBUTION.RULE.TO_BRAND')}</ModalHeader>
              <ModalBody>
                <Field
                  name="brand"
                  label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.TARGET_BRAND')}
                  component={FormikSelectField}
                  searchable
                >
                  {Object.keys(brandsConfig).map(value => (
                    <option key={value} value={value}>{brandsConfig[value].name}</option>
                  ))}
                </Field>
                <Field
                  name="quantity"
                  type="number"
                  label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.AMOUNT_MIGRATED_CLIENTS')}
                  step="1"
                  unit={baseUnits[baseUnit]}
                  component={FormikInputField}
                />
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
