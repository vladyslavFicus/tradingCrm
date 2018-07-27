import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { withModals } from '../../../../../../components/HighOrder';
import { shortBonusTemplatesQuery, bonusTemplateQuery } from '../../../../../../graphql/queries/campaigns';
import { currencyQuery } from '../../../../../../graphql/queries/options';
import CreateBonusModal from '../CreateBonusModal';
import BonusView from './BonusView';

export default compose(
  withModals({ createBonus: CreateBonusModal }),
  connect(({ auth: { brandId } }) => ({ brandId })),
  graphql(currencyQuery, {
    name: 'optionCurrencies',
    options: ({ brandId }) => ({
      variables: {
        brandId,
      },
    }),
    skip: ({ brandId }) => !brandId,
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
