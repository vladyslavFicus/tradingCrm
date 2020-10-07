import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { createValidator } from 'utils/validator';
import { FormikSelectField, FormikInputField } from 'components/Formik';
import { Button } from 'components/UI';
import { brands, baseUnits, sortTypes } from '../../constants';
import './AddSourceBrandModal.scss';

class AddSourceBrandModal extends PureComponent {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.shape({
      brand: PropTypes.string,
      distributionUnit: PropTypes.shape({
        quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
      initialValues: {
        brand,
        distributionUnit,
        sortType,
      },
    } = this.props;

    const { quantity, baseUnit } = distributionUnit || {};

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
            sortType,
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
                <div className="AddSourceBrandModal__row--amount">
                  <Field
                    name="quantity"
                    type="number"
                    label="Amount of clients for migration"
                    step="1"
                    component={FormikInputField}
                    className="AddSourceBrandModal__field--amount"
                  />
                  <Field
                    name="baseUnit"
                    label="&nbsp;"
                    component={FormikSelectField}
                    className="AddSourceBrandModal__field--unit"
                  >
                    {baseUnits.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </Field>
                </div>
                <Field
                  name="sortType"
                  label="Sort method"
                  component={FormikSelectField}
                >
                  {sortTypes.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
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
