import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { getBranchChildren, getBranchInfo } from 'graphql/queries/hierarchy';
import { getRules, getRulesRetention } from 'graphql/queries/rules';
import { createRule, createRuleRetention, deleteRule, deleteRuleRetention } from 'graphql/mutations/rules';
import countryList from 'utils/countryList';
import { deskTypes } from 'constants/rules';
import { branchTypes } from 'constants/hierarchyTypes';
import RuleModal from '../components/RuleModal';
import { withNotifications, withModals } from '../../HighOrder';
import ConfirmActionModal from '../../Modal/ConfirmActionModal';

const mapStateToProps = ({
  i18n: { locale },
}) => ({
  countries: countryList,
  locale,
});

export default (Component, type, branchType) => compose(
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
  graphql(getBranchInfo, {
    options: ({
      match: {
        params: {
          id: branchId,
        },
      },
    }) => ({
      variables: {
        branchId,
      },
    }),
    skip: branchType !== branchTypes.TEAM,
    name: 'getBranchInfo',
  }),
  graphql(getBranchChildren, {
    name: 'getBranchChildren',
    options: ({
      match: {
        params: {
          id: parentId,
        },
      },
    }) => ({
      variables: {
        uuid: parentId,
      },
    }),
    skip: branchType !== branchTypes.DESK,
  }),
  type === deskTypes.RETENTION
    ? graphql(getRulesRetention, {
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
    : graphql(getRules, {
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
    }),
)(Component);
