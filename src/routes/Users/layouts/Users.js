import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actionCreators as profileViewActionCreators } from '../modules/view';

class Users extends Component {
  componentWillMount() {
    const { profile, loadFullProfile, params } = this.props;

    if (!profile.isLoading) {
      loadFullProfile(params.id);
    }
  }

  render() {
    const { profile, tabs, content } = this.props;

    return <div className="page-content-inner">
      <nav className="top-submenu top-submenu-with-background">
        <div className="profile-header">
          <div className="profile-header-info">
            <div className="row">
              <div className="col-xl-8 col-xl-offset-4">
                <div className="profile-header-title">
                  <h2>{profile.data.username}</h2>
                  <p>{profile.data.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="row">
        <section className="panel profile-user-content">
          <div className="panel-body">
            <div className="nav-tabs-horizontal">
              {tabs}

              <div className="tab-content padding-vertical-20">
                {content}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>;
  }
}
const mapStateToProps = (state) => ({ profile: state.userProfile });
const mapActions = {
  ...profileViewActionCreators,
};

export default connect(mapStateToProps, mapActions)(Users);
