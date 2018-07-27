import { compose } from 'react-apollo';
import { reduxForm } from 'redux-form';
import OptInModal from './OptInModal';
import { createValidator, translateLabels } from '../../../../../../../../../../utils/validator';
import { attributeLabels } from '../../../../../../../../../Campaigns/components/Rewards/constants';

export default compose(
  reduxForm({
    form: 'opt-in-modal',
    enableReinitialize: true,
    validate: (values, props) => createValidator({
      deviceType: ['string', 'required', `in:,${props.deviceTypes.join()}`],
    }, translateLabels(attributeLabels), false)(values),
  }),
)(OptInModal);
