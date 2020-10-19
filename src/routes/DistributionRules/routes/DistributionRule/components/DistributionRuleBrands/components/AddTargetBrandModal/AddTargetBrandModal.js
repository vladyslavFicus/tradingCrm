import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { withApollo } from 'react-apollo';
import { Formik, Form, Field } from 'formik';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { createValidator, translateLabels } from 'utils/validator';
import { brandsConfig } from 'constants/brands';
import PropTypes from 'constants/propTypes';
import { FormikSelectField, FormikInputField } from 'components/Formik';
import { Button } from 'components/UI';
import operatorsByBrandQuery from './graphql/operatorsByBrandQuery';
import { baseUnits, modalFieldsNames } from '../../constants';
import './AddTargetBrandModal.scss';

class AddTargetBrandModal extends PureComponent {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    sourceBrand: PropTypes.string.isRequired,
    allowedBaseUnit: PropTypes.string.isRequired,
    initialValues: PropTypes.shape({
      brand: PropTypes.string,
      distributionUnit: PropTypes.shape({
        quantity: PropTypes.number,
        baseUnit: PropTypes.string,
      }),
      operator: PropTypes.string,
    }),
    fetchAvailableClientsAmount: PropTypes.func.isRequired,
    client: PropTypes.shape({
      query: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    initialValues: {},
  }

  state = {
    operatorsByBrand: [],
    operatorsLoading: false,
    availableClientsAmount: null,
  }

  componentDidMount() {
    const {
      initialValues: { brand: targetBrandId },
    } = this.props;

    if (targetBrandId) {
      this.fetchOperatorsByBrand(targetBrandId);
      this.fetchAvailableClientsAmount(targetBrandId);
    }
  }

  fetchOperatorsByBrand = async (brandId) => {
    const { client } = this.props;

    this.setState({
      operatorsLoading: true,
    });

    try {
      const { data: { operatorsByBrand } } = await client.query({
        query: operatorsByBrandQuery,
        variables: {
          brandId,
          hierarchyTypeGroup: 'SALES',
        },
      });

      this.setState({
        operatorsByBrand,
        operatorsLoading: false,
      });
    } catch {
      this.setState({
        operatorsLoading: false,
      });
    }
  };

  fetchAvailableClientsAmount = async (targetBrand) => {
    const {
      sourceBrand,
      fetchAvailableClientsAmount,
    } = this.props;

    try {
      const availableClientsAmount = await fetchAvailableClientsAmount(sourceBrand, targetBrand);
      this.setState({ availableClientsAmount });
    } catch {
      // ...
    }
  };

  handleBrandChange = setFieldValue => async (targetBrandId) => {
    this.fetchOperatorsByBrand(targetBrandId);
    this.fetchAvailableClientsAmount(targetBrandId);

    setFieldValue('brand', targetBrandId);
  };

  handleSubmit = ({ operator, ...values }) => {
    const { handleSubmit } = this.props;
    const { operatorsByBrand } = this.state;

    const operatorEntity = operatorsByBrand.find(({ uuid }) => uuid === operator);

    handleSubmit({
      ...values,
      ...operatorEntity && { operatorEntity },
    });
  };

  render() {
    const {
      onCloseModal,
      isOpen,
      allowedBaseUnit,
      initialValues: {
        brand,
        distributionUnit,
        operator,
      },
    } = this.props;

    const {
      operatorsByBrand,
      operatorsLoading,
      availableClientsAmount,
    } = this.state;

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
          validate={values => (
            createValidator({
              brand: 'required',
              quantity: ['required', 'integer', values.baseUnit === 'PERCENTAGE' ? 'between:1,100' : 'min:1'],
            }, translateLabels(modalFieldsNames))(values)
          )}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={this.handleSubmit}
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
                  name="operator"
                  label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.OPERATOR')}
                  placeholder={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.AUTO_OPERATOR')}
                  component={FormikSelectField}
                  disabled={operatorsLoading || !operatorsByBrand.length}
                >
                  {operatorsByBrand.map(({ uuid, fullName }) => (
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

export default withApollo(AddTargetBrandModal);
