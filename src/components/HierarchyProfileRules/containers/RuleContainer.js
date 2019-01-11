import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { withNotifications, withModals } from '../../HighOrder';
import ConfirmActionModal from '../../Modal/ConfirmActionModal';
import { getRules, getRulesRetention } from '../../../graphql/queries/rules';
import { createRule, createRuleRetention, deleteRule, deleteRuleRetention } from '../../../graphql/mutations/rules';
import countryList from '../../../utils/countryList';
import RuleModal from '../components/RuleModal';
import { deskTypes } from '../../../constants/rules';

const mapStateToProps = ({
  i18n: { locale },
  auth: { uuid },
}) => ({
  countries: countryList,
  auth: { uuid },
  locale,
});

export default (Component, type) => compose(
  withNotifications,
  withModals({
    ruleModal: RuleModal,
    deleteModal: ConfirmActionModal,
  }),
  connect(mapStateToProps),
  graphql(createRule, {
    name: 'createRule',
  }),
  graphql(createRuleRetention, {
    name: 'createRuleRetention',
  }),
  graphql(deleteRule, {
    name: 'deleteRule',
  }),
  graphql(deleteRuleRetention, {
    name: 'deleteRuleRetention',
  }),
  type === deskTypes.RETENTION ?
    graphql(getRulesRetention, {
      options: ({
        match: {
          params: {
            id: parentId,
          },
        },
        location: { query },
      }) => ({
        variables: {
          ...query && query.filters,
          parentId,
        },
      }),
      name: 'rules',
    })
    :
    graphql(getRules, {
      options: ({
        match: {
          params: {
            id: parentId,
          },
        },
        location: { query },
      }) => ({
        variables: {
          ...query && query.filters,
          parentId,
        },
      }),
      name: 'rules',
    })
)(Component);
