import { graphql, compose } from 'react-apollo';
import { withModals, withNotifications } from '../../../../../components/HighOrder';
import { addBonusMutation } from '.././../../../../graphql/mutations/bonusTemplates';
import { shortBonusTemplatesQuery, bonusTemplateQuery } from '.././../../../../graphql/queries/campaigns';
import CreateBonusModal from '../CreateBonusModal';
import BonusView from './BonusView';

export default compose(
  withNotifications,
  withModals({ createBonus: CreateBonusModal }),
  graphql(addBonusMutation, {
    name: 'addBonus',
  }),
  graphql(shortBonusTemplatesQuery, {
    name: 'shortBonusTemplates',
  }),
  graphql(bonusTemplateQuery, {
    options: ({ uuid }) => ({
      variables: {
        uuid,
      },
    }),
    skip: ({ uuid }) => !uuid,
    name: 'bonusTemplate',
  }),
)(BonusView);
