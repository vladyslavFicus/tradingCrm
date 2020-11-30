import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form } from 'formik';
import { withRequests } from 'apollo';
import { getAvailableLanguages } from 'config';
import PropTypes from 'constants/propTypes';
import { ruleTypes, priorities } from 'constants/rules';
import { attributeLabels, customErrors } from 'constants/ruleModal';
import { createValidator, translateLabels } from 'utils/validator';
import countryList from 'utils/countryList';
import { Button, StaticTabs, StaticTabsItem } from 'components/UI';
import RuleSettings from 'components/RuleSettings';
import { extraValidation } from './utils';
import { OperatorsQuery, PartnersQuery } from './graphql';
import CreateRuleSchedule from './CreateRuleSchedule';

class CreateRuleModal extends PureComponent {
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
    validationOnChangeEnabled: false,
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
      userType,
      userUuid,
      withOperatorSpreads,
    } = this.props;

    const operators = operatorsQueryData?.operators?.content || [];
    const partners = partnersQueryData?.partners?.content || [];

    return (
      <Modal
        toggle={onCloseModal}
        isOpen={isOpen}
      >
        <Formik
          initialValues={{
            name: '',
            type: '',
            priority: '',
            countries: [],
            languages: [],
            sources: [],
            affiliateUUIDs: userType === 'PARTNER' ? [userUuid] : [],
            operatorSpreads: userType === 'OPERATOR' ? [{ parentUser: userUuid, percentage: 100 }] : [],
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

            return extraValidation(values, errors, { withOperatorSpreads });
          }}
          validateOnBlur={false}
          validateOnChange={this.state.validationOnChangeEnabled}
          onSubmit={this.handleSubmit}
        >
          {({ values: { operatorSpreads }, ...formikBag }) => (
            <Form>
              <ModalHeader toggle={onCloseModal}>
                {I18n.t('HIERARCHY.PROFILE_RULE_TAB.MODAL.HEADER')}
              </ModalHeader>
              <ModalBody className="p-0">
                <StaticTabs>
                  <StaticTabsItem
                    label={I18n.t('RULE_MODAL.SETTINGS_TAB_NAME')}
                    component={RuleSettings}
                    operators={operators}
                    partners={partners}
                    withOperatorSpreads={withOperatorSpreads}
                    operatorSpreads={operatorSpreads}
                    formikBag={formikBag}
                  />
                  <StaticTabsItem
                    label={I18n.t('RULE_MODAL.SCHEDULE_TAB_NAME')}
                    component={CreateRuleSchedule}
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
})(CreateRuleModal);
