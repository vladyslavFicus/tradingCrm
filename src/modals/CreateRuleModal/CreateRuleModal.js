import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form } from 'formik';
import { parseErrors, withRequests } from 'apollo';
import { getAvailableLanguages } from 'config';
import { notify, LevelType } from 'providers/NotificationProvider';
import PropTypes from 'constants/propTypes';
import { ruleTypes, priorities } from 'constants/rules';
import { attributeLabels, customErrors } from 'constants/ruleModal';
import { decodeNullValues } from 'components/Formik/utils';
import { createValidator, translateLabels } from 'utils/validator';
import countryList from 'utils/countryList';
import { Button } from 'components/Buttons';
import StaticTabs, { StaticTabsItem } from 'components/StaticTabs';
import Uuid from 'components/Uuid';
import { Link } from 'components/Link';
import RuleSettings from 'components/RuleSettings';
import CreateRuleSchedule from './components/CreateRuleSchedule';
import { extraValidation } from './utils';
import {
  CreateRuleMutation,
  OperatorsSubordinatesQuery,
  PartnersQuery,
} from './graphql';

class CreateRuleModal extends PureComponent {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    createRuleMutation: PropTypes.func.isRequired,
    partnersQuery: PropTypes.query({
      partners: PropTypes.pageable(PropTypes.partnersListEntity),
    }).isRequired,
    operatorsSubordinatesQuery: PropTypes.query({
      operatorsSubordinates: PropTypes.pageable(PropTypes.operatorsListEntity),
    }).isRequired,
    onSuccess: PropTypes.func.isRequired,
    userType: PropTypes.string,
    parentBranch: PropTypes.string,
    withOperatorSpreads: PropTypes.bool,
  };

  static defaultProps = {
    userType: null,
    parentBranch: null,
    withOperatorSpreads: false,
  };

  state = {
    validationOnChangeEnabled: false,
  };

  handleSubmit = async ({ operatorSpreads, ...values }, { setSubmitting, setErrors }) => {
    const {
      onCloseModal,
      createRuleMutation,
      onSuccess,
      parentBranch,
      withOperatorSpreads,
    } = this.props;

    const variables = decodeNullValues(values);

    if (withOperatorSpreads) {
      variables.operatorSpreads = [
        // the filter needs to delete an empty value in array
        ...operatorSpreads.filter(item => item && item.percentage),
      ];
    } else {
      variables.parentBranch = parentBranch;
    }

    try {
      await createRuleMutation({ variables });

      onSuccess();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('HIERARCHY.PROFILE_RULE_TAB.RULE_CREATED'),
      });
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('HIERARCHY.PROFILE_RULE_TAB.RULE_NOT_CREATED'),
      });

      let _error = error.error;

      if (_error === 'error.entity.already.exist') {
        _error = (
          <>
            <div>
              <Link
                to={{
                  pathname: '/sales-rules',
                  query: { filters: { createdByOrUuid: error.errorParameters.ruleUuid } },
                }}
                onClick={onCloseModal}
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
      operatorsSubordinatesQuery: {
        data: operatorsSubordinatesData,
      },
      partnersQuery: {
        data: partnersQueryData,
      },
      userType,
      parentBranch,
      withOperatorSpreads,
    } = this.props;

    const operators = operatorsSubordinatesData?.operatorsSubordinates || [];
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
            affiliateUUIDs: userType === 'PARTNER' ? [parentBranch] : [],
            ...withOperatorSpreads && {
              operatorSpreads: userType === 'OPERATOR' ? [{ parentUser: parentBranch, percentage: 100 }] : [],
            },
          }}
          validate={(values) => {
            const errors = createValidator({
              name: ['required', 'string'],
              priority: ['required', `in:${priorities.join()}`],
              type: ['required', `in:${ruleTypes.map(({ value }) => value).join()}`],
              countries: `in:${Object.keys(countryList).join()}`,
              languages: `in:${getAvailableLanguages().join()}`,
              'operatorSpreads.*.percentage': ['between:1,100', 'integer'],
              ...withOperatorSpreads && {
                'operatorSpreads.0.parentUser': 'required',
              },
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
                  <StaticTabsItem label={I18n.t('RULE_MODAL.SETTINGS_TAB_NAME')}>
                    <RuleSettings
                      operators={operators}
                      partners={partners}
                      operatorSpreads={operatorSpreads}
                      formikBag={formikBag}
                    />
                  </StaticTabsItem>
                  <StaticTabsItem label={I18n.t('RULE_MODAL.SCHEDULE_TAB_NAME')}>
                    <CreateRuleSchedule />
                  </StaticTabsItem>
                </StaticTabs>
              </ModalBody>
              <ModalFooter>
                <Button
                  tertiary
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

export default compose(
  withRequests({
    createRuleMutation: CreateRuleMutation,
    operatorsSubordinatesQuery: OperatorsSubordinatesQuery,
    partnersQuery: PartnersQuery,
  }),
)(CreateRuleModal);
