import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import CreateModal from './CreateModal';
import { withReduxFormValues } from '../../../../../../../../components/HighOrder';
import { createValidator, translateLabels } from '../../../../../../../../utils/validator';
import {
  lockAmountStrategy,
  moneyTypeUsage,
} from '../../../../../../../../constants/bonus-campaigns';
import { customValueFieldTypes } from '../../../../../../../../constants/form';
import { attributeLabels } from './constants';

const mapStateToProps = ({
  userBonusesList: {
    templates: { data: templates },
  },
}) => ({
  templates,
});

export default compose(
  connect(mapStateToProps),
  reduxForm({
    form: 'manual-bonus-modal',
    enableReinitialize: true,
    initialValues: {
      moneyTypePriority: moneyTypeUsage.REAL_MONEY_FIRST,
      claimable: false,
      lockAmountStrategy: lockAmountStrategy.LOCK_ALL,
      wageringRequirement: {
        type: customValueFieldTypes.ABSOLUTE,
      },
      prizeCapingType: customValueFieldTypes.ABSOLUTE,
    },
    validate: (values) => {
      const rules = {
        name: ['string', 'required'],
        bonusLifeTime: ['integer', 'min:1', 'max:230', 'required'],
        moneyTypePriority: ['string', 'required'],
        lockAmountStrategy: ['string', 'required'],
        grantRatio: ['numeric', 'required'],
        prizeCapingType: ['string'],
        capping: ['numeric', 'min:0'],
        prize: ['numeric', 'min:0'],
        wageringRequirement: {
          type: ['string'],
          value: ['required', 'numeric', 'min:0'],
        },
      };

      if (values.prize) {
        rules.capping.push('greaterThan:prize');
      }

      if (values.capping) {
        rules.prize.push('lessThan:capping');
      }

      return createValidator(rules, translateLabels(attributeLabels), false)(values);
    },
  }),
  withReduxFormValues,
)(CreateModal);
