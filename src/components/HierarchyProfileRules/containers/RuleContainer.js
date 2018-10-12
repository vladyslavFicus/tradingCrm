import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { withNotifications, withModals } from '../../HighOrder';
import ConfirmActionModal from '../../Modal/ConfirmActionModal';
import { getRules } from '../../../graphql/queries/rules';
import { createRule, deleteRule } from '../../../graphql/mutations/rules';
import countryList from '../../../utils/countryList';
import RuleModal from '../components/RuleModal';

const mapStateToProps = ({
  i18n: { locale },
  auth: { uuid },
}) => ({
  countries: countryList,
  auth: { uuid },
  locale,
});

export default Component => compose(
  withNotifications,
  withModals({
    ruleModal: RuleModal,
    deleteModal: ConfirmActionModal,
  }),
  connect(mapStateToProps),
  graphql(createRule, {
    name: 'createRule',
  }),
  graphql(deleteRule, {
    name: 'deleteRule',
  }),
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
  }),
)(Component);
