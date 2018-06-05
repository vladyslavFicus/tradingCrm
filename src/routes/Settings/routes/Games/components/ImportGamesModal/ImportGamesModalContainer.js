import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { createValidator } from '../../../../../../utils/validator';
import { withNotifications } from '../../../../../../components/HighOrder';
import ImportGamesModal from './ImportGamesModal';
import { actionCreators } from '../../modules';
import attributeLabels from '../../constants';

const mapStateToProps = (state) => {
  const {
    games: {
      options: { aggregators },
      files,
    },
  } = state;

  return {
    aggregators,
    files,
  };
};
const mapActions = {
  getAggregators: actionCreators.fetchGameAggregators,
  uploadFile: actionCreators.uploadFile,
};

export default compose(
  connect(mapStateToProps, mapActions),
  reduxForm({
    form: 'gameImportModal',
    shouldError: ({ props }) => !props.touched,
    validate: createValidator({
      file: ['required'],
    }, attributeLabels, false),
  }),
  withNotifications,
)(ImportGamesModal);
