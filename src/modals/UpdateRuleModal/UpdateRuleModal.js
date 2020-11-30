import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form } from 'formik';
import { withRequests } from 'apollo';
import { getAvailableLanguages } from 'config';
import PropTypes from 'constants/propTypes';
import { ruleTypes, priorities } from 'constants/rules';
import { attributeLabels, customErrors, nestedFieldsNames } from 'constants/ruleModal';
import { createValidator, translateLabels } from 'utils/validator';
import countryList from 'utils/countryList';
import { Button, StaticTabs, StaticTabsItem } from 'components/UI';
import RuleSettings from 'components/RuleSettings';
import {
  OperatorsQuery,
  PartnersQuery,
  RulesQuery,
} from './graphql';
import {
  nestedFieldsTranslator,
  extraValidation,
} from './utils';
import RuleSchedule from './RuleSchedule';

class UpdateRuleModal extends PureComponent {
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
    withOperatorSpreads: PropTypes.bool,
  };

  static defaultProps = {
    withOperatorSpreads: false,
  };

  state = {
    validationOnChangeEnabled: false,
    validationSchedulesEnabled: false,
  };

  enableSchedulesValidation = () => {
    this.setState({ validationSchedulesEnabled: true });
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
      withOperatorSpreads,
    } = this.props;

    const {
      validationOnChangeEnabled,
      validationSchedulesEnabled,
    } = this.state;

    const operators = operatorsQueryData?.operators?.content || [];
    const partners = partnersQueryData?.partners?.content || [];

    const {
      name,
      type,
      priority,
      countries,
      languages,
      partners: currentPartners,
      sources,
      operatorSpreads,
      enableScheduling,
      schedules,
    } = rulesQueryData?.rules?.['0'] || {};

    return (
      <Modal
        toggle={onCloseModal}
        isOpen={isOpen}
      >
        <Formik
          initialValues={{
            name,
            type,
            priority,
            countries,
            languages,
            sources,
            affiliateUUIDs: (currentPartners || []).map(
              ({ uuid }) => uuid,
            ),
            operatorSpreads: (operatorSpreads || []).map(
              ({ parentUser, percentage }) => ({ parentUser, percentage }),
            ),
            enableScheduling,
            schedules: (schedules?.length && schedules) || [
              {
                days: [],
                timeIntervals: [
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
              ...validationSchedulesEnabled && {
                'schedules.*.timeIntervals.*.operatorSpreads.*.percentage': ['between:1,100', 'integer'],
                'schedules.*.timeIntervals.*.operatorSpreads.0.parentUser': ['required'],
              },
            }, translateLabels(attributeLabels), false, customErrors)(values);

            return nestedFieldsTranslator(
              extraValidation(values, errors, { withOperatorSpreads, validationSchedulesEnabled }),
              nestedFieldsNames,
            );
          }}
          validateOnBlur={false}
          validateOnChange={validationOnChangeEnabled}
          onSubmit={this.handleSubmit}
          enableReinitialize
        >
          {({ values, ...formikBag }) => (
            <Form>
              <ModalHeader toggle={onCloseModal}>
                {I18n.t('HIERARCHY.PROFILE_RULE_TAB.EDIT_MODAL.HEADER')}
              </ModalHeader>
              <ModalBody className="p-0">
                <StaticTabs>
                  <StaticTabsItem
                    label="Rule settings"
                    component={RuleSettings}
                    operators={operators}
                    partners={partners}
                    withOperatorSpreads={withOperatorSpreads}
                    operatorSpreads={values.operatorSpreads}
                    formikBag={formikBag}
                  />
                  <StaticTabsItem
                    label="Schedule settings"
                    component={RuleSchedule}
                    operators={operators}
                    schedules={values.schedules}
                    formikBag={formikBag}
                    enableSchedulesValidation={this.enableSchedulesValidation}
                    validationSchedulesEnabled={validationSchedulesEnabled}
                  />
                </StaticTabs>
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
                  disabled={!formikBag.dirty || formikBag.isSubmitting}
                  onClick={() => this.setState({ validationOnChangeEnabled: true })}
                >
                  {I18n.t('HIERARCHY.PROFILE_RULE_TAB.EDIT_MODAL.SAVE_CHANGES')}
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
})(UpdateRuleModal);
