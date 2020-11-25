import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form } from 'formik';
import { withRequests } from 'apollo';
import { getAvailableLanguages } from 'config';
import PropTypes from 'constants/propTypes';
import { ruleTypes, priorities } from 'constants/rules';
import { createValidator, translateLabels } from 'utils/validator';
import countryList from 'utils/countryList';
import { Button, Tabs, TabsItem } from 'components/UI';
import {
  OperatorsQuery,
  PartnersQuery,
  RulesQuery,
} from './graphql';
import { attributeLabels, customErrors } from './constants';
import RuleSettings from './components/RuleSettings';
import RuleSchedule from './components/RuleSchedule';
import './RuleModal.scss';

class RuleModal extends PureComponent {
  static propTypes = {
    // ----- Modal API
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    // -----
    // ----- Queries
    partnersQuery: PropTypes.query({
      partners: PropTypes.pageable(PropTypes.partnersListEntity),
    }).isRequired,
    operatorsQuery: PropTypes.query({
      operators: PropTypes.pageable(PropTypes.operatorsListEntity),
    }).isRequired,
    rulesQuery: PropTypes.query({
      rules: PropTypes.arrayOf(PropTypes.ruleType),
    }).isRequired,
    // -----
    onSubmit: PropTypes.func.isRequired,
    userType: PropTypes.string, // SalesRules only
    userUuid: PropTypes.string, // SalesRules only
    withOperatorSpreads: PropTypes.bool, // SalesRules only
  };

  static defaultProps = {
    userType: null,
    userUuid: null,
    withOperatorSpreads: false,
  };

  state = {
    validationByChange: false,
  };

  handleSubmit = (values, { setSubmitting, setErrors }) => {
    this.props.onSubmit(values, setErrors);
    setSubmitting(false);
  };

  render() {
    const {
      onCloseModal,
      isOpen,
      operatorsQuery: {
        data: operatorsQueryData,
      },
      partnersQuery: {
        data: partnersQueryData,
      },
      rulesQuery: {
        data: rulesQueryData,
      },
      userType,
      userUuid,
      withOperatorSpreads,
    } = this.props;

    const operators = operatorsQueryData?.operators?.content || [];
    const partners = partnersQueryData?.partners?.content || [];

    const {
      name,
      type,
      priority,
      ruleType,
      countries,
      languages,
      partners: currentPartners,
      sources,
      actions,
    } = rulesQueryData?.rules?.['0'] || {};
    const currentOperators = actions?.['0']?.operatorSpreads;

    const initialValues = {
      affiliateUUIDs: userType === 'PARTNER' ? [userUuid] : [],
      operatorSpreads: userType === 'OPERATOR' ? [{ parentUser: userUuid, percentage: 100 }] : [],
    };

    if (currentPartners) {
      initialValues.affiliateUUIDs = currentPartners.map(({ uuid }) => uuid);
    }

    if (currentOperators) {
      initialValues.operatorSpreads = currentOperators.map(
        ({ parentUser, percentage }) => ({ parentUser, percentage }),
      );
    }

    return (
      <Modal
        toggle={onCloseModal}
        isOpen={isOpen}
        className="RuleModal"
      >
        <Formik
          initialValues={{
            ...initialValues,
            name,
            type,
            priority,
            ruleType,
            countries,
            languages,
            sources,
            schedule: [
              {
                week: {},
                timeInterval: [
                  {
                    operatorSpreads: [],
                    timeFrom: '00:00',
                    timeTo: '00:00',
                  },
                ],
              },
            ],
          }}
          validate={(values) => {
            const errors = createValidator({
              name: ['required', 'string'],
              priority: ['required', `in:${priorities.join()}`],
              countries: [`in:${Object.keys(countryList).join()}`],
              languages: [`in:${getAvailableLanguages().join()}`],
              'operatorSpreads.*.percentage': ['between:1,100', 'integer'],
              ...withOperatorSpreads && {
                'operatorSpreads.0.parentUser': 'required',
              },
              type: ['required', `in:${ruleTypes.map(({ value }) => value).join()}`],
            }, translateLabels(attributeLabels), false, customErrors)(values);

            const percentageLimitError = withOperatorSpreads && values.operatorSpreads.length
              && values.operatorSpreads.reduce((a, b) => a + (b.percentage || 0), 0) !== 100;

            return { ...errors, ...percentageLimitError && { percentageLimitError } };
          }}
          validateOnBlur={false}
          validateOnChange={this.state.validationByChange}
          onSubmit={this.handleSubmit}
          enableReinitialize
        >
          {({
            values: { operatorSpreads, schedule },
            setFieldValue,
            dirty,
            errors,
            isSubmitting,
          }) => (
            <Form>
              <ModalHeader toggle={onCloseModal}>
                {I18n.t('HIERARCHY.PROFILE_RULE_TAB.MODAL.HEADER')}
              </ModalHeader>
              <ModalBody className="RuleModal__body">
                <Tabs>
                  <TabsItem
                    label="Rule settings"
                    component={RuleSettings}
                    operators={operators}
                    partners={partners}
                    withOperatorSpreads={withOperatorSpreads}
                    operatorSpreads={operatorSpreads}
                    setFieldValue={setFieldValue}
                    isSubmitting={isSubmitting}
                    errors={errors}
                  />
                  <TabsItem
                    label="Schedule settings"
                    component={RuleSchedule}
                    operators={operators}
                    schedule={schedule}
                    setFieldValue={setFieldValue}
                    isSubmitting={isSubmitting}
                    errors={errors}
                  />
                </Tabs>
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
                  disabled={!dirty || isSubmitting}
                  onClick={() => this.setState({ validationByChange: true })}
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
  rulesQuery: RulesQuery,
})(RuleModal);
