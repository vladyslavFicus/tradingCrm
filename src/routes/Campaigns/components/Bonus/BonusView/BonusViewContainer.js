import { graphql, compose } from 'react-apollo';
import { withModals, withNotifications } from '../../../../../components/HighOrder';
import { addBonusMutation } from '.././../../../../graphql/mutations/bonusTemplates';
import CreateBonusModal from '../CreateBonusModal';
import BonusView from './BonusView';

export default compose(
  withNotifications,
  withModals({ createBonus: CreateBonusModal }),
  graphql(addBonusMutation, {
    name: 'addBonus',
  }),
)(BonusView);
