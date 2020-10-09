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
  }

  static defaultProps = {
    initialValues: {},
  }

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
          {() => (
            <Form>
              <ModalHeader>{I18n.t('CLIENTS_DISTRIBUTION.RULE.FROM_BRAND')}</ModalHeader>
              <ModalBody>
                <Field
                  name="brand"
                  label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.SOURCE_BRAND')}
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
                  name="sortType"
                  label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.SORT_METHOD')}
                  component={FormikSelectField}
                >
                  {Object.keys(sortTypes).map(value => (
                    <option key={value} value={value}>{renderLabel(value, sortTypes)}</option>
                  ))}
                </Field>
              </ModalBody>
              <ModalFooter className="AddSourceBrandModal__actions">
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
