import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import shallowEqual from 'utils/shallowEqual';

class View extends Component {
  componentWillReceiveProps(nextProps) {
    const { kycMetaData, fetchFile } = this.props;

    if (!shallowEqual(kycMetaData, nextProps.kycMetaData)) {
      if (nextProps.kycMetaData && nextProps.kycMetaData.length > 0) {
        nextProps.kycMetaData
          .forEach((item) => fetchFile({ fileId: item.id, profileId: nextProps.id }));
      }
    }
  }

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
    const { kycMetaData, userDocuments } = this.props;
    if (!userDocuments) {
      return null;
    }

    return <div className={classNames('tab-pane fade in active')}>
      <div className="form-group row">
        <div className="col-sm-10">
          <div className="app-gallery clearfix">
            {kycMetaData.map(item => {
              const url = userDocuments[item.id];

              return url && this.renderFile({ ...item, url });
            })}
          </div>
        </div>
      </div>
    </div>;
  }
}

export default View;
