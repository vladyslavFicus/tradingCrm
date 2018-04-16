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
import { wageringRequirementTypes } from '../constants';
import { customValueFieldTypes } from '../../../../../constants/form';

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
    enableReinitialize: true,
    validate: createValidator({
      name: ['required', 'string'],
      currency: ['required', 'string'],
      lockAmountStrategy: ['required', 'string'],
      moneyTypePriority: ['required', 'string'],
      wagerWinMultiplier: ['required', 'numeric'],
      maxBet: ['required', 'string'],
      prize: {
        value: ['numeric'],
        type: ['required', 'string'],
      },
      grantRatio: {
        value: ['required', 'numeric'],
        type: ['required', 'string'],
      },
      wageringRequirement: {
        value: ['required', 'numeric'],
        type: ['required', 'string'],
      },
      capping: {
        value: ['numeric'],
        type: ['required', 'string'],
      },
      bonusLifeTime: ['required', 'integer'],
    }, {}, false),
    initialValues: {
      claimable: false,
      prize: {
        type: customValueFieldTypes.ABSOLUTE,
      },
      grantRatio: {
        type: customValueFieldTypes.ABSOLUTE,
      },
      capping: {
        type: customValueFieldTypes.ABSOLUTE,
      },
      wageringRequirement: {
        type: Object.keys(wageringRequirementTypes)[0],
      },
    },
  }),
  withReduxFormValues,
)(CreateBonusModal);
