import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators } from '../modules/index';

const mapStateToProps = (state) => {
  const props = {
    ...state.userFiles,
    profile: state.profile.profile,
    uploadModalInitialValues: {},
  };

  const uploadingFilesUUIDs = Object.keys(props.uploading);
  if (uploadingFilesUUIDs.length) {
    uploadingFilesUUIDs.forEach((uuid) => {
      props.uploadModalInitialValues[uuid] = { title: '', category: '' };
    });
  }

  return props;
};

export default connect(mapStateToProps, actionCreators)(View);
