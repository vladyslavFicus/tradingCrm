import React from 'react';
import View from '../components/View';
import { connect } from 'react-redux';
import { actionCreators as filesActionCreators } from '../modules/files';

const mapStateToProps = ({
  profile: { view: { profile: { data: { id, kycMetaData }, receivedAt } } },
  userDocuments,
}) => ({
  id,
  profileLoaded: !!receivedAt,
  kycMetaData: kycMetaData || [],
  userDocuments,
});

const mapActions = {
  clearFiles: filesActionCreators.clearFiles,
  fetchFile: filesActionCreators.fetchFile,
};

export default connect(mapStateToProps, mapActions)(View);
