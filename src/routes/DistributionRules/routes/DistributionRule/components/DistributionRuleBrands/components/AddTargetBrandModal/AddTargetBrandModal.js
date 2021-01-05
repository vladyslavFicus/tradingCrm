import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { withApollo, compose } from 'react-apollo';
import { Formik, Form, Field } from 'formik';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { withRequests } from 'apollo';
import { createValidator, translateLabels } from 'utils/validator';
import PropTypes from 'constants/propTypes';
import { FormikSelectField, FormikInputField } from 'components/Formik';
import { Button } from 'components/UI';
import operatorsByBrandQuery from './graphql/operatorsByBrandQuery';
import PartnersQuery from './graphql/PartnersQuery';
import { baseUnits, modalFieldsNames } from '../../constants';
import './AddTargetBrandModal.scss';

class AddTargetBrandModal extends PureComponent {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    sourceBrandId: PropTypes.string.isRequired,
    sourceBrandQuantity: PropTypes.number.isRequired,
    initialValues: PropTypes.shape({
      brand: PropTypes.string,
      distributionUnit: PropTypes.shape({
        quantity: PropTypes.number,
        baseUnit: PropTypes.string,
      }),
      migrationSource: PropTypes.string,
      operator: PropTypes.string,
    }).isRequired,
    fetchAvailableClientsAmount: PropTypes.func.isRequired,
    client: PropTypes.shape({
      query: PropTypes.func.isRequired,
    }).isRequired,
    partnersQuery: PropTypes.query({
      cdePartners: PropTypes.arrayOf(
        PropTypes.shape({
          uuid: PropTypes.string,
          fullName: PropTypes.string,
          brand: PropTypes.string,
        }),
      ),
    }).isRequired,
    brands: PropTypes.arrayOf(PropTypes.brandConfig).isRequired,
  };

  state = {
    operatorsByBrand: [],
    operatorsLoading: false,
    sourceBrandQuantity: null,
    availableClientsAmount: null,
  }

  componentDidMount() {
    const {
      initialValues: { brand: targetBrandId },
    } = this.props;

    if (targetBrandId) {
      this.fetchOperatorsByBrand(targetBrandId);
    }

    this.fetchAvailableClientsAmount();
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

  /**
   * #1 fetch and compute source brand available amount and cache it
   * #2 then, if targetBrand is available, fetch and compute target brand available amount
   */
  fetchAvailableClientsAmount = async () => {
    const {
      sourceBrandQuantity,
      fetchAvailableClientsAmount,
      initialValues: {
        distributionUnit: {
          baseUnit,
        },
        brand: targetBrand,
      },
    } = this.props;

    try {
      let computedSourceBrandQuantity = sourceBrandQuantity;

      if (baseUnit === 'PERCENTAGE') {
        const availableSourceClientsAmount = await fetchAvailableClientsAmount();
        computedSourceBrandQuantity = Math.floor(availableSourceClientsAmount * sourceBrandQuantity / 100);
      }

      this.setState({
        sourceBrandQuantity: computedSourceBrandQuantity,
      }, () => targetBrand && this.fetchAvailableTargetClientsAmount(targetBrand));
    } catch {
      // ...
    }
  };

  fetchAvailableTargetClientsAmount = async (targetBrand) => {
    const { fetchAvailableClientsAmount } = this.props;
    const { sourceBrandQuantity } = this.state;

    if (!sourceBrandQuantity) {
      this.setState({ availableClientsAmount: 0 });
      return;
    }

    this.setState({ availableClientsAmount: null });

    try {
      const availableClientsAmount = await fetchAvailableClientsAmount(targetBrand);
      this.setState({ availableClientsAmount: Math.min(availableClientsAmount, sourceBrandQuantity) });
    } catch {
      // ...
    }
  };

  handleBrandChange = setFieldValue => (targetBrandId) => {
    this.fetchOperatorsByBrand(targetBrandId);
    this.fetchAvailableTargetClientsAmount(targetBrandId);

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
      sourceBrandId,
      brands,
      partnersQuery: {
        data: partnersData,
      },
      initialValues: {
        brand,
        distributionUnit: {
          quantity,
          baseUnit,
        },
        migrationSource,
        operator,
      },
    } = this.props;

    const {
      operatorsByBrand,
      operatorsLoading,
      availableClientsAmount,
    } = this.state;

    const partners = partnersData?.cdePartners || [];

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
            migrationSource,
            operator,
          }}
          validate={values => (
            createValidator({
              brand: 'required',
              quantity: ['required', 'integer', 'min:1',
                `max:${values.baseUnit === 'PERCENTAGE' ? 100 : availableClientsAmount}`,
              ],
              migrationSource: 'required',
            }, translateLabels({
              ...modalFieldsNames,
              quantity: values.baseUnit === 'PERCENTAGE'
                ? modalFieldsNames.quantityPercentage
                : modalFieldsNames.quantity,
            }))(values)
          )}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={this.handleSubmit}
        >
          {({ values, setFieldValue }) => {
            const partnersByBrand = partners.filter(({ brand: partnerBrand }) => values.brand === partnerBrand);

            return (
              <Form>
                <ModalHeader>{I18n.t('CLIENTS_DISTRIBUTION.RULE.TARGET_BRAND')}</ModalHeader>
                <ModalBody>
                  <Field
                    name="brand"
                    label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.TARGET_BRAND')}
                    component={FormikSelectField}
                    customOnChange={this.handleBrandChange(setFieldValue)}
                    searchable
                  >
                    {brands
                      .filter(_brand => _brand.brandId !== sourceBrandId)
                      .map(_brand => (
                        <option key={_brand.brandId} value={_brand.brandId}>
                          {_brand.brandName}
                        </option>
                      ))
                    }
                  </Field>
                  <If condition={values.brand}>
                    <div
                      className="AddTargetBrandModal__message"
                      dangerouslySetInnerHTML={{
                        __html: I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.AVAILABLE_CLIENTS_AMOUNT', {
                          value: typeof availableClientsAmount === 'number'
                            ? availableClientsAmount
                            : '<span class="AddTargetBrandModal__message-spinner">...</span>',
                        }),
                      }}
                    />
                  </If>
                  <div className="AddTargetBrandModal__row">
                    <Field
                      name="quantity"
                      type="number"
                      label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.AMOUNT_MIGRATED_CLIENTS')}
                      step="1"
                      addition={baseUnits[baseUnit]}
                      additionPosition="right"
                      className="AddTargetBrandModal__field AddTargetBrandModal__field--quantity"
                      disabled={!availableClientsAmount}
                      component={FormikInputField}
                    />
                  </div>
                  <Field
                    name="migrationSource"
                    label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.MIGRATION_SOURCE')}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                    component={FormikSelectField}
                    disabled={!partnersByBrand.length}
                    searchable
                  >
                    {partnersByBrand.map(({ uuid, fullName }) => (
                      <option key={uuid} value={uuid}>{fullName}</option>
                    ))}
                  </Field>
                  <Field
                    name="operator"
                    label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.OPERATOR')}
                    placeholder={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.AUTO_OPERATOR')}
                    component={FormikSelectField}
                    disabled={operatorsLoading || !operatorsByBrand.length}
                    searchable
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
            );
          }}
        </Formik>
      </Modal>
    );
  }
}

export default compose(
  withApollo,
  withRequests({
    partnersQuery: PartnersQuery,
  }),
)(AddTargetBrandModal);
