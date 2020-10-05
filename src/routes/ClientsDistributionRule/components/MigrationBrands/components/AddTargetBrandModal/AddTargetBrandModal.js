import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { withRequests } from 'apollo';
import { createValidator } from 'utils/validator';
import PropTypes from 'constants/propTypes';
import { FormikSelectField, FormikInputField } from 'components/Formik';
import { Button } from 'components/UI';
import { OperatorsQuery } from './graphql';
import { brands, clientsAmountUnits } from '../../constants';
import './AddTargetBrandModal.scss';

class AddTargetBrandModal extends PureComponent {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    operators: PropTypes.query({
      operators: PropTypes.pageable(PropTypes.shape({
        uuid: PropTypes.string,
        fullName: PropTypes.string,
      })),
    }).isRequired,
    initialValues: PropTypes.object,
  };

  static defaultProps = {
    initialValues: {
      brandId: '',
      clientsAmount: '',
      clientsAmountUnit: '',
      operatorUuid: '',
    },
  }

  handleSubmit = ({ operatorUuid, ...values }) => {
    const {
      handleSubmit,
      operators: {
        data: operatorsData,
      },
    } = this.props;

    const operators = operatorsData?.operators?.content || [];

    handleSubmit({
      ...values,
      operator: operators.find(({ uuid }) => uuid === operatorUuid) || {
        fullName: 'Automatic operator',
      },
    });
  };

  render() {
    const {
      onCloseModal,
      isOpen,
      operators: {
        data: operatorsData,
        loading: operatorsLoading,
      },
      initialValues,
    } = this.props;

    const operators = operatorsData?.operators?.content || [];

    return (
      <Modal
        toggle={onCloseModal}
        isOpen={isOpen}
        className="AddTargetBrandModal"
      >
        <Formik
          initialValues={initialValues}
          validate={createValidator({
            brandId: 'required',
            clientsAmount: 'required',
          })}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={this.handleSubmit}
        >
          {() => (
            <Form>
              <ModalHeader>From brand</ModalHeader>
              <ModalBody>
                <Field
                  name="brandId"
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
                    name="clientsAmount"
                    type="number"
                    label="Amount of clients for migration"
                    step="1"
                    component={FormikInputField}
                    className="AddTargetBrandModal__field--amount"
                  />
                  <Field
                    name="clientsAmountUnit"
                    label="&nbsp;"
                    component={FormikSelectField}
                    className="AddTargetBrandModal__field--unit"
                  >
                    {clientsAmountUnits.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </Field>
                </div>
                <Field
                  name="operatorUuid"
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

export default withRequests({
  operators: OperatorsQuery,
})(AddTargetBrandModal);
