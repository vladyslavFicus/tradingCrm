import { graphql, compose } from 'react-apollo';
import update from 'react-addons-update';
import { reduxForm } from 'redux-form';
import { withNotifications, withReduxFormValues } from '../../../../../../../../../../../../components/HighOrder';
import { addBonusMutation } from '.././../../../../../../../../../../../graphql/mutations/bonusTemplates';
import { shortBonusTemplatesQuery } from '../../../../../../../../../../../../graphql/queries/campaigns';
import CreateBonusModal from './CreateBonusModal';
import { wageringRequirementTypes } from '../constants';
import { customValueFieldTypes } from '../../../../../../../../../../../../constants/form';
import validator from './validator';

const FORM_NAME = 'manualFreeSpinBonusModal';

export default compose(
  withNotifications,
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
    form: FORM_NAME,
    shouldError: ({ props }) => !props.touched,
    enableReinitialize: true,
    validate: validator,
    initialValues: {
      claimable: false,
      prizeCapingType: customValueFieldTypes.ABSOLUTE,
      grantRatio: {
        type: customValueFieldTypes.ABSOLUTE,
      },
      wageringRequirement: {
        type: Object.keys(wageringRequirementTypes)[0],
      },
    },
  }),
  withReduxFormValues,
)(CreateBonusModal);
