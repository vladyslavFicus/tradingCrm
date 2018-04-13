import { graphql, compose } from 'react-apollo';
import update from 'react-addons-update';
import { reduxForm } from 'redux-form';
import { getBrandId } from '../../../../../config';
import { withNotifications, withReduxFormValues } from '../../../../../components/HighOrder';
import { addBonusMutation } from '.././../../../../graphql/mutations/bonusTemplates';
import { currencyQuery } from '../../../../../graphql/queries/options';
import { shortBonusTemplatesQuery } from '../../../../../graphql/queries/campaigns';
import CreateBonusModal from './CreateBonusModal';
import { createValidator } from '../../../../../utils/validator';

export default compose(
  withNotifications,
  graphql(currencyQuery, {
    name: 'optionCurrencies',
    options: {
      fetchPolicy: 'network-only',
      variables: {
        brandId: getBrandId(),
      },
    },
  }),
  graphql(addBonusMutation, {
    name: 'addBonus',
    options: {
      update: (proxy, { data: { bonusTemplate: { add: { error, data } } } }) => {
        if (error) {
          return;
        }

        const { shortBonusTemplates } = proxy.readQuery({ query: shortBonusTemplatesQuery });
        const updatedShortBonusTemplates = update(shortBonusTemplates, {
          $push: [data],
        });

        proxy.writeQuery({
          query: shortBonusTemplatesQuery,
          data: {
            shortBonusTemplates: updatedShortBonusTemplates,
          },
        });
      },
    },
  }),
  reduxForm({
    form: 'addRewardsBonus',
    shouldError: ({ props }) => !props.touched,
    validate: createValidator({
      name: ['required', 'string'],
    }, {}, false),
    initialValues: {
      claimable: false,
    },
  }),
  withReduxFormValues,
)(CreateBonusModal);
