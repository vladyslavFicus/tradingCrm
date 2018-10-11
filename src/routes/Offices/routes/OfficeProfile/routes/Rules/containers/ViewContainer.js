import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { withNotifications, withModals } from '../../../../../../../components/HighOrder';
import ConfirmActionModal from '../../../../../../../components/Modal/ConfirmActionModal';
import { getRules } from '../../../../../../../graphql/queries/rules';
import { createRule, deleteRule } from '../../../../../../../graphql/mutations/rules';
import countryList from '../../../../../../../utils/countryList';
import RuleModal from '../components/RuleModal';
import View from '../components/View';

const mapStateToProps = ({
  i18n: { locale },
  auth: { uuid },
}) => ({
  countries: countryList,
  auth: { uuid },
  locale,
});

export default compose(
  withNotifications,
  withModals({
    ruleModal: RuleModal,
    deleteModal: ConfirmActionModal,
  }),
  connect(mapStateToProps),
  graphql(createRule, {
    name: 'createOfficeRule',
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
)(View);
