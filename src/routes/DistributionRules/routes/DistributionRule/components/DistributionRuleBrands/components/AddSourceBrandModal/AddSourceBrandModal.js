import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
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
import BranchesQuery from './graphql/BranchesQuery';
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
      desks: PropTypes.arrayOf(PropTypes.string),
      teams: PropTypes.arrayOf(PropTypes.string),
    }),
    fetchAvailableClientsAmount: PropTypes.func.isRequired,
    brands: PropTypes.arrayOf(PropTypes.brandConfig).isRequired,
    branchesQuery: PropTypes.query({
      userBranches: PropTypes.shape({
        TEAM: PropTypes.arrayOf(PropTypes.hierarchyBranch),
        DESK: PropTypes.arrayOf(PropTypes.hierarchyBranch),
      }),
    }).isRequired,
  }

  static defaultProps = {
    initialValues: {},
  }

  state = {
    availableClientsAmount: null,
  }

  componentDidMount() {
    const {
      initialValues: {
        brand,
        desks,
        teams,
      },
    } = this.props;

    if (brand) {
      this.fetchAvailableClientsAmount({ brand, desks, teams });
    }
  }

  fetchAvailableClientsAmount = async ({ brand, desks, teams }) => {
    const {
      fetchAvailableClientsAmount,
    } = this.props;

    this.setState({ availableClientsAmount: null });

    try {
      const availableClientsAmount = await fetchAvailableClientsAmount({ sourceBrand: brand, desks, teams });
      this.setState({ availableClientsAmount });
    } catch {
      // ...
    }
  };

  handleBrandChange = (setValues, values) => (brand) => {
    setValues({
      ...values,
      brand,
      desks: null,
      teams: null,
    });

    this.fetchAvailableClientsAmount({
      brand,
    });

    this.props.branchesQuery.refetch({ brandId: brand });
  };

  handleDesksChange = (setValues, values) => (desks) => {
    const {
      branchesQuery: {
        data: branchesData,
      },
    } = this.props;

    const availableTeams = branchesData?.userBranches?.TEAM || [];

    // if there are selected teams and desks, need to keep selected teams related to selected desks
    const teams = values.teams && desks
      ? availableTeams
        .filter(({ uuid, parentBranch }) => values.teams.includes(uuid) && desks.includes(parentBranch?.uuid))
        .map(({ uuid }) => uuid)
      : null;

    setValues({
      ...values,
      desks,
      teams,
    });

    this.fetchAvailableClientsAmount({
      brand: values.brand,
      desks,
      teams,
    });
  };

  handleTeamsChange = (setFieldValue, { brand, desks }) => (teams) => {
    setFieldValue('teams', teams);

    this.fetchAvailableClientsAmount({
      brand,
      desks,
      teams,
    });
  };

  render() {
    const {
      onCloseModal,
      isOpen,
      allowedBaseUnits,
      brands,
      initialValues: {
        brand,
        distributionUnit,
        sortType,
        desks,
        teams,
      },
      handleSubmit,
      branchesQuery: {
        data: branchesData,
        loading: branchesLoading,
      },
    } = this.props;

    const { availableClientsAmount } = this.state;

    const { quantity, baseUnit } = distributionUnit || { baseUnit: allowedBaseUnits[0] };

    const limitAmount = Math.min(availableClientsAmount, MAX_MIGRATED_CLIENTS);
    const limitAmountPercentage = Math.min(100, Math.floor(MAX_MIGRATED_CLIENTS / availableClientsAmount * 100));

    const availableDesks = branchesData?.userBranches?.DESK || [];
    const availableTeams = branchesData?.userBranches?.TEAM || [];

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
            desks,
            teams,
          }}
          validate={values => (
            createValidator({
              brand: 'required',
              quantity: ['required', 'integer', 'min:1',
                `max:${values.baseUnit === 'PERCENTAGE' ? limitAmountPercentage : limitAmount}`,
              ],
            }, translateLabels({
              ...modalFieldsNames,
              quantity: values.baseUnit === 'PERCENTAGE'
                ? modalFieldsNames.quantityPercentage
                : modalFieldsNames.quantity,
            }), false, {
              ...(limitAmountPercentage < 100) && {
                'max.quantity': I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.AVAILABLE_CLIENTS_BY_PERCENTAGE', {
                  amount: availableClientsAmount,
                  percentage: limitAmountPercentage,
                }),
              },
            })(values)
          )}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={handleSubmit}
        >
          {({ values, setValues, setFieldValue }) => {
            const filteredTeams = values.desks?.length
              ? availableTeams.filter(({ parentBranch }) => values.desks.includes(parentBranch?.uuid))
              : availableTeams;

            return (
              <Form>
                <ModalHeader>{I18n.t('CLIENTS_DISTRIBUTION.RULE.SOURCE_BRAND')}</ModalHeader>
                <ModalBody>
                  <Field
                    name="brand"
                    label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.SOURCE_BRAND')}
                    component={FormikSelectField}
                    customOnChange={this.handleBrandChange(setValues, values)}
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
                            ? availableClientsAmount
                            : '<span class="AddSourceBrandModal__message-spinner">...</span>',
                        }),
                      }}
                    />
                  </If>
                  <div className="AddSourceBrandModal__row">
                    <Field
                      name="desks"
                      label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.DESKS')}
                      placeholder={
                        I18n.t(
                          (!branchesLoading && availableDesks.length === 0)
                            ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                            : 'COMMON.SELECT_OPTION.ANY',
                        )
                      }
                      className="AddSourceBrandModal__field"
                      component={FormikSelectField}
                      customOnChange={this.handleDesksChange(setValues, values)}
                      disabled={branchesLoading || availableDesks.length === 0}
                      searchable
                      multiple
                    >
                      {availableDesks.map(({ uuid, name }) => (
                        <option key={uuid} value={uuid}>
                          {name}
                        </option>
                      ))}
                    </Field>
                    <Field
                      name="teams"
                      label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.TEAMS')}
                      placeholder={
                        I18n.t(
                          (!branchesLoading && filteredTeams.length === 0)
                            ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                            : 'COMMON.SELECT_OPTION.ANY',
                        )
                      }
                      className="AddSourceBrandModal__field"
                      component={FormikSelectField}
                      customOnChange={this.handleTeamsChange(setFieldValue, values)}
                      disabled={branchesLoading || filteredTeams.length === 0}
                      searchable
                      multiple
                    >
                      {filteredTeams.map(({ uuid, name }) => (
                        <option key={uuid} value={uuid}>
                          {name}
                        </option>
                      ))}
                    </Field>
                  </div>
                  <div className="AddSourceBrandModal__row">
                    <Field
                      name="quantity"
                      type="number"
                      label={I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.AMOUNT_MIGRATED_CLIENTS')}
                      step="1"
                      className="AddSourceBrandModal__field"
                      disabled={!availableClientsAmount}
                      component={FormikInputField}
                    />
                    <Field
                      name="baseUnit"
                      label="&nbsp;"
                      className="AddSourceBrandModal__field AddSourceBrandModal__field--small"
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
            );
          }}
        </Formik>
      </Modal>
    );
  }
}

export default withRequests({
  branchesQuery: BranchesQuery,
})(AddSourceBrandModal);
