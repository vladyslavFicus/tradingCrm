import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import shallowEqual from 'utils/shallowEqual';

class View extends Component {
  componentWillReceiveProps(nextProps) {
    if (!shallowEqual(this.props.kycMetaData, nextProps.kycMetaData)) {
      if (nextProps.kycMetaData && nextProps.kycMetaData.length > 0) {
        this.fetchFiles(nextProps.kycMetaData, nextProps.id);
      }
    }
  }

  componentDidMount() {
    const { kycMetaData, id } = this.props;

    if (kycMetaData.length > 0) {
      this.fetchFiles(kycMetaData, id);
    }
  }

  fetchFiles = (kycMetaData, profileId) => {
    const { fetchFile } = this.props;

    kycMetaData
      .forEach((item, id, array) => fetchFile({
          fileId: item.id,
          profileId: profileId,
          isLoading: id !== array.length - 1,
        }
      ));
  };

  renderFile({ id, name, url }) {
    return <div
      key={id}
      className="app-gallery-item edit"
      style={{ backgroundImage: `url(${url})` }}
    >
      <div className="app-gallery-item-hover">
        <div className="btn-group margin-inline">
          <a href={url} download={name} className="btn">
            <i className="fa fa-download"/>
          </a>
        </div>
      </div>
    </div>;
  }

  render() {
    const {
      kycMetaData,
      userDocuments: { items, isLoading },
      profileLoaded,
    } = this.props;

    if (!profileLoaded) {
      return null;
    }

    if (kycMetaData.length === 0) {
      return <div>No documents</div>;
    }

    const content = isLoading ?
      <div className="form-input-icon"><i className="icmn-spinner11 util-spin"></i></div> :

      <div className={classNames('tab-pane fade in active')}>
        <div className="form-group row">
          <div className="col-sm-10">
            <div className="app-gallery clearfix">
              {kycMetaData.map(item => {
                const url = items[item.id];

                return url && this.renderFile({ ...item, url });
              })}
            </div>
          </div>
        </div>
      </div>;

    return content;
  }
}

export default View;
