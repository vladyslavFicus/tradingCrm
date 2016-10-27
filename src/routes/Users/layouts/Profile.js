import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actionCreators as profileViewActionCreators } from '../modules/view';
import { actionCreators as bonusActionCreators } from '../modules/bonus';

class Users extends Component {
  componentWillMount() {
    const { profile, loadFullProfile, fetchActiveBonus, params } = this.props;

    if (!profile.isLoading) {
      loadFullProfile(params.id)
        .then(() => fetchActiveBonus(params.id));
    }
  }

  render() {
    const { profile, tabs, content } = this.props;

    return <div className="page-content-inner">
      <nav className="top-submenu top-submenu-with-background">
        <div className="profile-header">
          <div className="profile-header-info">
            <div className="row">
              <div className="col-xl-8">
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
const mapStateToProps = (state) => ({
  ...state.userProfile,
  bonus: { ...state.userBonus },
});
const mapActions = {
  ...profileViewActionCreators,
  ...bonusActionCreators,
};

export default connect(mapStateToProps, mapActions)(Users);
