import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form } from 'formik';
import { withNotifications } from 'hoc';
import { parseErrors, withRequests } from 'apollo';
import { getAvailableLanguages } from 'config';
import PropTypes from 'constants/propTypes';
import { ruleTypes, priorities, actionRuleTypes } from 'constants/rules';
import { attributeLabels, customErrors, nestedFieldsNames } from 'constants/ruleModal';
import { decodeNullValues } from 'components/Formik/utils';
import { createValidator, translateLabels } from 'utils/validator';
import countryList from 'utils/countryList';
import { Button, StaticTabs, StaticTabsItem } from 'components/UI';
import Uuid from 'components/Uuid';
import { Link } from 'components/Link';
import RuleSettings from 'components/RuleSettings';
import RuleSchedule from './components/RuleSchedule';
import {
  UpdateRuleMutation,
  OperatorsQuery,
  PartnersQuery,
  RulesQuery,
} from './graphql';
import {
  nestedFieldsTranslator,
  extraValidation,
} from './utils';

class UpdateRuleModal extends PureComponent {
  static propTypes = {
    // ----- Modal API
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    // -----
    notify: PropTypes.func.isRequired,
    // ----- Queries
    updateRuleMutation: PropTypes.func.isRequired,
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
    onSuccess: PropTypes.func.isRequired,
    uuid: PropTypes.string.isRequired,
    parentBranch: PropTypes.string,
    withOperatorSpreads: PropTypes.bool,
  };

  static defaultProps = {
    parentBranch: null,
    withOperatorSpreads: false,
  };

  state = {
    validationOnChangeEnabled: false,
    validationSchedulesEnabled: false,
  };

  enableSchedulesValidation = () => {
    this.setState({ validationSchedulesEnabled: true });
  };

  handleSubmit = async ({ operatorSpreads, ...values }, { setSubmitting, setErrors }) => {
    const {
      notify,
      updateRuleMutation,
      onSuccess,
      uuid,
      parentBranch,
      withOperatorSpreads,
    } = this.props;

    try {
      await updateRuleMutation(
        {
          variables: {
            uuid,
            parentBranch,
            ruleType: actionRuleTypes.ROUND_ROBIN,
            ...withOperatorSpreads && {
              operatorSpreads: [
                // the filter needs to delete an empty value in array
                ...operatorSpreads.filter(item => item && item.percentage),
              ],
            },
            ...decodeNullValues(values),
          },
        },
      );

      onSuccess();

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('HIERARCHY.PROFILE_RULE_TAB.RULE_UPDATED'),
      });
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('HIERARCHY.PROFILE_RULE_TAB.RULE_UPDATED'),
      });

      let _error = error.error;

      if (error.error === 'error.entity.already.exist') {
        _error = (
          <>
            <div>
              <Link
                to={{
                  pathname: '/sales-rules',
                  query: { filters: { createdByOrUuid: error.errorParameters.ruleUuid } },
                }}
              >
                {I18n.t(`rules.${error.error}`, error.errorParameters)}
              </Link>
            </div>
            <Uuid uuid={error.errorParameters.ruleUuid} uuidPrefix="RL" />
          </>
        );
      }

      setErrors({ submit: _error });
    }

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
      enableSchedule,
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
            enableSchedule,
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
                    label={I18n.t('RULE_MODAL.SETTINGS_TAB_NAME')}
                    component={RuleSettings}
                    operators={operators}
                    partners={partners}
                    withOperatorSpreads={withOperatorSpreads}
                    operatorSpreads={values.operatorSpreads}
                    formikBag={formikBag}
                  />
                  <StaticTabsItem
                    label={I18n.t('RULE_MODAL.SCHEDULE_TAB_NAME')}
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

export default compose(
  withNotifications,
  withRequests({
    updateRuleMutation: UpdateRuleMutation,
    operatorsQuery: OperatorsQuery,
    partnersQuery: PartnersQuery,
    rulesQuery: RulesQuery,
  }),
)(UpdateRuleModal);
