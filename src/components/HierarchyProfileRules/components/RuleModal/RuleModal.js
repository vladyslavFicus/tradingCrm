import React, { PureComponent, Fragment } from 'react';
import { get } from 'lodash';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Formik, Form, Field, FieldArray } from 'formik';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { getAvailableLanguages } from 'config';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import { createValidator, translateLabels } from 'utils/validator';
import countryList from 'utils/countryList';
import { Button } from 'components/UI';
import { isSales } from 'constants/hierarchyTypes';
import { RangeGroup } from 'components/Forms';
import {
  FormikInputField,
  FormikSelectField,
  FormikMultiInputField,
} from 'components/Formik';
import {
  ruleTypes,
  priorities,
  clientDistribution,
  depositCount,
  deskTypes,
} from 'constants/rules';
import { OperatorsQuery, PartnersQuery } from './graphql';
import { attributeLabels, customErrors } from './constants';
import './RuleModal.scss';

const validate = (deskType, withOperatorSpreads) => createValidator({
  name: ['required', 'string'],
  priority: ['required', `in:${priorities.join()}`],
  countries: [`in:${Object.keys(countryList).join()}`],
  languages: [`in:${getAvailableLanguages().join()}`],
  'operatorSpreads.*.percentage': ['between:1,100', 'integer'],
  ...withOperatorSpreads && {
    operatorSpreads: 'required',
  },
  ...(deskType !== deskTypes.RETENTION) && {
    type: ['required', `in:${ruleTypes.map(({ value }) => value).join()}`],
  },
  ...(deskType === deskTypes.RETENTION) && {
    ruleType: ['required', `in:${clientDistribution.map(({ value }) => value).join()}`],
    depositAmountFrom: ['required', 'integer'],
    depositAmountTo: ['required', 'integer'],
  },
}, translateLabels(attributeLabels), false, customErrors);

class RuleModal extends PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    deskType: PropTypes.string.isRequired,
    partnersQuery: PropTypes.response({
      partners: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.partnersListEntity),
      }),
    }).isRequired,
    operatorsQuery: PropTypes.response({
      operators: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.operatorsListEntity),
      }),
    }).isRequired,
    type: PropTypes.string,
    currentUuid: PropTypes.string,
    withOperatorSpreads: PropTypes.bool,
  };

  static defaultProps = {
    currentUuid: null,
    type: null,
    withOperatorSpreads: false,
  };

  state = {
    ...(this.props.type === 'OPERATOR' ? { selectedOperators: [this.props.currentUuid] } : { selectedOperators: [] }),
    percentageLimitError: false,
  };

  onHandleSubmit = (values, { setSubmitting, setErrors }) => {
    if (this.props.withOperatorSpreads
      && values.operatorSpreads.reduce((a, b) => a + (b.percentage || 0), 0) !== 100
      && this.state.selectedOperators.length !== 0
    ) {
      this.setState({ percentageLimitError: true });
    } else {
      this.setState({ percentageLimitError: false });

      this.props.onSubmit(values, setErrors);
    }
    setSubmitting(false);
  };

  onHandleSelect = (index, name, value, setFieldValue, arrayHelpers) => {
    const { selectedOperators } = this.state;

    this.setState({ selectedOperators: [...selectedOperators, value] });

    arrayHelpers.insert(index, '');

    setFieldValue(name, value);
  };

  render() {
    const {
      onCloseModal,
      currentUuid,
      type,
      isOpen,
      deskType,
      operatorsQuery: {
        data: operatorsQueryData,
      },
      partnersQuery: {
        data: partnersQueryData,
      },
      withOperatorSpreads,
    } = this.props;

    const partnersList = get(partnersQueryData, 'partners.content', []);
    const operatorsList = get(operatorsQueryData, 'operators.content', []);
    const {
      selectedOperators,
      percentageLimitError,
    } = this.state;

    return (
      <Modal
        toggle={onCloseModal}
        isOpen={isOpen}
      >
        <Formik
          initialValues={{
            name: '',
            priority: '',
            depositCount: '',
            depositAmountFrom: '',
            depositAmountTo: '',
            ruleType: '',
            countries: '',
            languages: '',
            type: '',
            affiliateUUIDs: type === 'PARTNER' ? [currentUuid] : '',
            ...(type === 'OPERATOR'
              ? { operatorSpreads: [{ parentUser: currentUuid, percentage: 100 }, ''] }
              : { operatorSpreads: [''] }),
          }}
          validate={validate(deskType, withOperatorSpreads)}
          onSubmit={this.onHandleSubmit}
        >
          {({ errors, dirty, isValid, isSubmitting, values: { operatorSpreads }, setFieldValue }) => (
            <Form className="RuleModal">
              <ModalHeader toggle={onCloseModal}>
                {I18n.t('HIERARCHY.PROFILE_RULE_TAB.MODAL.HEADER')}
              </ModalHeader>
              <ModalBody>
                <If condition={errors && errors.submit}>
                  <div className="mb-2 text-center color-danger RuleModal__message-error">
                    {errors.submit}
                  </div>
                </If>
                <Field
                  name="name"
                  label={I18n.t(attributeLabels.name)}
                  placeholder={I18n.t(attributeLabels.name)}
                  disabled={isSubmitting}
                  component={FormikInputField}
                />
                <div className="row">
                  <Field
                    name="priority"
                    label={I18n.t(attributeLabels.priority)}
                    component={FormikSelectField}
                    disabled={isSubmitting}
                    className="col-6"
                    placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  >
                    {priorities.map(item => (
                      <option key={item} value={item}>
                        {item.toString()}
                      </option>
                    ))}
                  </Field>
                  <Choose>
                    <When condition={deskType === deskTypes.RETENTION}>
                      <Field
                        name="depositCount"
                        label={I18n.t(attributeLabels.depositCount)}
                        component={FormikSelectField}
                        disabled={isSubmitting}
                        className="col-6"
                        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                      >
                        {depositCount.map(item => (
                          <option key={item} value={item}>
                            {item.toString()}
                          </option>
                        ))}
                      </Field>
                      <RangeGroup
                        className="col-6"
                        label={I18n.t(attributeLabels.amount)}
                      >
                        <Field
                          name="depositAmountFrom"
                          type="number"
                          placeholder="0"
                          step="1"
                          component={FormikInputField}
                        />
                        <Field
                          name="depositAmountTo"
                          type="number"
                          placeholder="0"
                          step="1"
                          component={FormikInputField}
                        />
                      </RangeGroup>
                      <Field
                        name="ruleType"
                        label={I18n.t(attributeLabels.ruleType)}
                        component={FormikSelectField}
                        disabled={isSubmitting}
                        className="col-6"
                        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                      >
                        {clientDistribution.map(({ label, value }) => (
                          <option key={value} value={value}>
                            {I18n.t(label)}
                          </option>
                        ))}
                      </Field>
                    </When>
                    <Otherwise>
                      <Field
                        name="type"
                        label={I18n.t(attributeLabels.type)}
                        component={FormikSelectField}
                        disabled={isSubmitting}
                        className="col-6"
                        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                      >
                        {ruleTypes.map(({ label, value }) => (
                          <option key={value} value={value}>
                            {I18n.t(label)}
                          </option>
                        ))}
                      </Field>
                    </Otherwise>
                  </Choose>
                </div>
                <Field
                  name="countries"
                  label={I18n.t(attributeLabels.country)}
                  component={FormikSelectField}
                  disabled={isSubmitting}
                  searchable
                  multiple
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT_MULTISELECT')}
                >
                  {Object.entries(countryList).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </Field>
                <Field
                  name="languages"
                  label={I18n.t(attributeLabels.language)}
                  component={FormikSelectField}
                  disabled={isSubmitting}
                  multiple
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT_MULTISELECT')}
                >
                  {getAvailableLanguages().map(locale => (
                    <option key={locale} value={locale}>
                      {I18n.t(`COMMON.LANGUAGE_NAME.${locale.toUpperCase()}`, { defaultValue: locale.toUpperCase() })}
                    </option>
                  ))}
                </Field>
                <If condition={deskType === deskTypes.SALES}>
                  <Field
                    name="affiliateUUIDs"
                    label={I18n.t(attributeLabels.partner)}
                    component={FormikSelectField}
                    disabled={isSubmitting || partnersList.length === 0}
                    multiple
                    placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT_MULTISELECT')}
                    searchable
                  >
                    {partnersList.sort((a, b) => a.fullName.localeCompare(b.fullName)).map(partner => (
                      <option key={partner.uuid} value={partner.uuid}>
                        {partner.fullName}
                      </option>
                    ))}
                  </Field>
                  <Field
                    name="sources"
                    label={I18n.t(attributeLabels.source)}
                    placeholder={I18n.t(attributeLabels.source)}
                    component={FormikMultiInputField}
                  />
                </If>
                <If condition={withOperatorSpreads}>
                  <div className="row">
                    <FieldArray
                      name="operatorSpreads"
                      render={arrayHelpers => (
                        <Fragment>
                          {operatorSpreads.map(({ parentUser }, index) => (
                            <Fragment key={index}>
                              <Field
                                name={`operatorSpreads[${index}].parentUser`}
                                label={index === 0 ? I18n.t(attributeLabels.operator) : ''}
                                component={FormikSelectField}
                                customOnChange={value => this.onHandleSelect(
                                  index,
                                  `operatorSpreads[${index}].parentUser`,
                                  value,
                                  setFieldValue,
                                  arrayHelpers,
                                )}
                                className="col-7"
                                disabled={isSubmitting}
                                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                                searchable
                              >
                                {operatorsList
                                  .filter(({ hierarchy: { userType } }) => isSales(userType))
                                  .map(({ uuid, fullName, operatorStatus }) => (
                                    <option
                                      key={uuid}
                                      value={uuid}
                                      disabled={selectedOperators.indexOf(uuid) !== -1 || operatorStatus !== 'ACTIVE'}
                                    >
                                      {fullName}
                                    </option>
                                  ))
                                }
                              </Field>
                              <Field
                                name={`operatorSpreads[${index}].percentage`}
                                type="number"
                                placeholder={index === 0 ? '100%' : '0%'}
                                label={index === 0 ? I18n.t(attributeLabels.ratio) : ''}
                                disabled={isSubmitting || !operatorSpreads[index]}
                                component={FormikInputField}
                                className={
                                  classNames('col-4', {
                                    'input--has-error': percentageLimitError,
                                  })
                                }
                              />
                              <If condition={selectedOperators.length > 0 && selectedOperators.length !== index}>
                                <Button
                                  transparent
                                  className="RuleModal__button"
                                  onClick={() => {
                                    arrayHelpers.remove(index);
                                    selectedOperators.splice(selectedOperators.indexOf(parentUser), 1);

                                    this.setState({
                                      selectedOperators,
                                    });
                                  }}
                                >
                                  <i className="fa fa-trash btn-transparent color-danger" />
                                </Button>
                              </If>
                            </Fragment>
                          ))}
                        </Fragment>
                      )}
                    />
                    <If condition={percentageLimitError}>
                      <div className="RuleModal__percentage-error color-danger">
                        <div className="col-7">
                          {I18n.t('HIERARCHY.PROFILE_RULE_TAB.MODAL.PERCENTAGE_LIMIT_ERROR')}
                        </div>
                      </div>
                    </If>
                  </div>
                </If>
              </ModalBody>
              <ModalFooter>
                <Button
                  commonOutline
                  onClick={onCloseModal}
                >
                  {I18n.t('COMMON.BUTTONS.CANCEL')}
                </Button>
                <Button
                  primary
                  type="submit"
                  disabled={!dirty || !isValid || isSubmitting}
                >
                  {I18n.t('HIERARCHY.PROFILE_RULE_TAB.MODAL.CREATE_BUTTON')}
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
  operatorsQuery: OperatorsQuery,
  partnersQuery: PartnersQuery,
})(RuleModal);
