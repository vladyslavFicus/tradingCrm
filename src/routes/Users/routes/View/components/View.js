import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actionCreators as viewActionCreators } from '../modules/view';
import classNames from 'classnames';
import Tabs from './Tabs';
import { stopEvent } from 'utils/helpers';

const tabItems = {
  'profile': { label: 'Profile', isActive: true, component: Tabs.Profile },
};

class View extends Component {
  constructor(props) {
    super(props);

    const state = {
      tabItems: { ...tabItems },
    };

    if (Object.keys(state.tabItems).length > 0) {
      state.activeTabName = Object.keys(state.tabItems)[0];
    }

    this.state = state;
  }

  componentWillMount() {
    const { profile, loadProfile, params } = this.props;

    if ((!profile.receivedAt || params.id !== profile.data.uiid) && !profile.isLoading) {
      loadProfile(params.id);
    }
  }

  onTabClick(e) {
    stopEvent(e);

    const name = e.target.getAttribute('data-name');
    const { tabItems, activeTabName } = this.state;
    if (name && name !== activeTabName) {
      if (tabItems[activeTabName] && tabItems[name]) {
        delete tabItems[activeTabName].isActive;
        tabItems[name].isActive = true;

        this.setState({
          activeTabName: name,
          tabItems,
        });
      }
    }
  }

  render() {
    const { profile } = this.props;
    const { tabItems } = this.state;

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
              <ul className="nav nav-tabs" role="tablist">
                {Object.keys(tabItems).map(function (name) {
                  const item = tabItems[name];

                  return <li key={name}
                             onClick={this.onTabClick.bind(this)}
                             className={classNames('nav-item', { 'active': !!item.isActive })}>
                    <a className={classNames('nav-link', { 'active': !!item.isActive })}
                       data-name={name}
                       href={`#tab-${name}`}>
                      {item.label}
                    </a>
                  </li>;
                }.bind(this))}
              </ul>

              <div className="tab-content padding-vertical-20">
                {Object.keys(tabItems).map(function (name) {
                  const item = tabItems[name];

                  return <item.component key={name} name={name} profile={profile} {...item}/>;
                }.bind(this))}
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
  ...viewActionCreators
};

export default connect(mapStateToProps, mapActions)(View);
