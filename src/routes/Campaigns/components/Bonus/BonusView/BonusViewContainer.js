import { graphql, compose } from 'react-apollo';
import { withModals } from '../../../../../components/HighOrder';
import { shortBonusTemplatesQuery, bonusTemplateQuery } from '.././../../../../graphql/queries/campaigns';
import CreateBonusModal from '../CreateBonusModal';
import BonusView from './BonusView';

export default compose(
  withModals({ createBonus: CreateBonusModal }),
  graphql(shortBonusTemplatesQuery, {
    name: 'shortBonusTemplates',
  }),
  graphql(bonusTemplateQuery, {
    options: ({ uuid }) => ({
      variables: {
        uuid,
      },
    }),
    skip: ({ uuid }) => !
    uuid,
    name: 'bonusTemplate',
  }),
)(BonusView);
