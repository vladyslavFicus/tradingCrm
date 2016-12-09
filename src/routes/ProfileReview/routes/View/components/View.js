import React, { Component, PropTypes } from 'react';
import Panel, { Title, Content } from 'components/Panel';
import ApprovalDropDown from './ApprovalDropDown';
import classNames from 'classnames';
import { actionTypes } from '../modules/index';

class View extends Component {
  constructor(props) {
    super(props);

    this.handleApprove = this.handleApprove.bind(this);
    this.handleReject = this.handleReject.bind(this);
  }

  componentWillMount() {
    const { fetchFile, fetchProfile, params } = this.props;

    fetchProfile(params.uuid)
      .then((action) => {
        if (action.type === actionTypes.FETCH_PROFILE.SUCCESS) {
          const { kycMetaData, id } = action.payload;

          if (kycMetaData && kycMetaData.length > 0) {
            kycMetaData
              .forEach((item) => fetchFile({ fileId: item.id, profileId: id }));
          }
        }
      });
  }

  componentWillUnmount() {
    const { files, clearFiles }  = this.props;

    Object.keys(files).forEach(key => URL.revokeObjectURL(files[key]));

    clearFiles();
  }

  handleApprove() {
    const { view: { data }, approveProfile, fetchProfile, params } = this.props;

    approveProfile(data.id)
      .then(() => fetchProfile(params.uuid));
  }

  handleReject(reason) {
    const { view: { data }, rejectProfile, fetchProfile, params } = this.props;

    rejectProfile(data.id, reason)
      .then(() => fetchProfile(params.uuid));
  }

  render() {
    const { view: { data }, files } = this.props;

    return <div className="page-content-inner">
      <Panel withBorders>
        <Title>
          <div className="heading-buttons pull-right">
            {data.state === 'IN_REVIEW' ? <ApprovalDropDown
              onApprove={this.handleApprove}
              onReject={this.handleReject}
            /> : <span className={classNames('label', {
              'label-danger': data.state === 'REJECTED',
              'label-success': data.state === 'APPROVED',
            })}>{data.state}</span>}
          </div>

          <h3>KYC Data</h3>
        </Title>

        <Content>
          <div className="form-group row">
            <label className="col-sm-1 col-form-label text-right">First name</label>
            <div className="col-sm-10">
              {data.firstName}
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-1 col-form-label text-right">Last name</label>
            <div className="col-sm-10">
              {data.lastName}
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-1 col-form-label text-right">Address</label>
            <div className="col-sm-10">
              {data.address}
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-1 col-form-label text-right">Files</label>
            <div className="col-sm-10">
              <div className="app-gallery clearfix">
                {data.kycMetaData.map((item, index) => {
                  const url = files[item.id];

                  return url && this.renderFile({ ...item, url });
                })}
              </div>
            </div>
          </div>
        </Content>
      </Panel>
    </div>;
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
}

View.propTypes = {
  view: PropTypes.object.isRequired,
  files: PropTypes.object.isRequired,
  fetchProfile: PropTypes.func.isRequired,
  approveProfile: PropTypes.func.isRequired,
  rejectProfile: PropTypes.func.isRequired,
};

export default View;
