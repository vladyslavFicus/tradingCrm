import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { withApollo } from '@apollo/client/react/hoc';
import { Formik, Form, Field } from 'formik';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { withRequests } from 'apollo';
import { createValidator, translateLabels } from 'utils/validator';
import PropTypes from 'constants/propTypes';
import { FormikSelectField, FormikInputField, FormikCheckbox } from 'components/Formik';
import { Button } from 'components/UI';
import { baseUnits, modalFieldsNames } from '../../constants';
import operatorsByBrandQuery from './graphql/operatorsByBrandQuery';
import PartnersQuery from './graphql/PartnersQuery';
import './AddTargetBrandModal.scss';

class AddTargetBrandModal extends PureComponent {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    sourceBrand: PropTypes.string.isRequired,
    sourceBrandQuantity: PropTypes.number.isRequired,
    initialValues: PropTypes.shape({
      brand: PropTypes.string,
      copyAffiliateSource: PropTypes.bool,
      distributionUnit: PropTypes.shape({
        quantity: PropTypes.number,
        baseUnit: PropTypes.string,
      }),
      affiliateUuid: PropTypes.string,
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

  /**
   * #1 fetch and compute source brand available amount and cache it
   * #2 then, if targetBrand is available, fetch and compute target brand available amount
   */
  fetchAvailableClientsAmount = async (targetBrand) => {
    const {
      sourceBrandQuantity,
      fetchAvailableClientsAmount,
      initialValues: {
        distributionUnit: {
          baseUnit,
        },
      },
    } = this.props;

    try {
      this.setState({ availableClientsAmount: null });

      const totalAvailableTargetClientsAmount = await fetchAvailableClientsAmount(targetBrand);

      let availableClientsAmount = Math.min(sourceBrandQuantity, totalAvailableTargetClientsAmount);

      if (baseUnit === 'PERCENTAGE') {
        availableClientsAmount = Math.floor(totalAvailableTargetClientsAmount / 100 * sourceBrandQuantity);
      }

      this.setState({ availableClientsAmount });
    } catch {
      // ...
    }
  };

  handleBrandChange = setFieldValue => (targetBrandId) => {
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
      sourceBrand,
      brands,
      partnersQuery: {
        data: partnersData,
      },
      initialValues: {
        brand,
        copyAffiliateSource,
        distributionUnit: {
          quantity,
          baseUnit,
        },
        affiliateUuid,
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
            affiliateUuid,
            operator,
            copyAffiliateSource,
          }}
          validate={values => (
            createValidator({
              brand: 'required',
              quantity: ['required', 'integer', 'min:1',
                `max:${values.baseUnit === 'PERCENTAGE' ? 100 : availableClientsAmount}`,
              ],
              affiliateUuid: 'required',
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
                      .filter(_brand => _brand.brandId !== sourceBrand)
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
                  <If condition={baseUnit === 'PERCENTAGE' && values.quantity <= 100 && availableClientsAmount}>
                    <div className="AddTargetBrandModal__absolute-clients-count">
                      {I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.ABSOLUTE_CLIENTS_COUNT', {
                        value: Math.floor(availableClientsAmount / 100 * values.quantity),
                      })}
                    </div>
                  </If>
                  <Field
                    name="affiliateUuid"
                    label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.AFFILIATE')}
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
                  <Field
                    name="copyAffiliateSource"
                    label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.COPY_SOURCE')}
                    component={FormikCheckbox}
                  />
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
