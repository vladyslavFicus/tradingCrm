import { compose } from 'react-apollo';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { withNotifications, withReduxFormValues } from '../../../../../../../components/HighOrder';
import { actionCreators } from '../../../modules';
import { createValidator, translateLabels } from '../../../../../../../utils/validator';
import { attributeLabels } from './constants';
import UploadPlayersModal from './UploadPlayersModal';

const mapActions = {
  uploadPlayersFile: actionCreators.uploadPlayersFile,
  uploadResetPlayersFile: actionCreators.uploadResetPlayersFile,
  uploadSoftResetPlayersFile: actionCreators.uploadSoftResetPlayersFile,
};

export default compose(
  connect(null, mapActions),
  withNotifications,
  reduxForm({
    form: 'uploadPlayersModal',
    validate: createValidator({
      type: ['required', 'string'],
    }, translateLabels(attributeLabels), false),
    enableReinitialize: true,
  }),
  withReduxFormValues,
)(UploadPlayersModal);
