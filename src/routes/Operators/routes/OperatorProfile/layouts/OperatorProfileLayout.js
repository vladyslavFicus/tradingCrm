import React, { Component, PropTypes } from 'react';
import Tabs from '../../../../../components/Tabs';
import { operatorProfileTabs } from 'config/menu';
import Header from '../components/Header';

export default class OperatorProfileLayout extends Component {
  render() {
    console.log(this.props);

    const {
      location,
      params,
      children,
    } = this.props;

    return (
      <div className="player container panel profile-layout">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <Header operatorProfile={this.props.data} />
            </div>
          </div>
          <div className="row">
            <section className="panel profile-user-content">
              <div className="panel-body">
                <div className="nav-tabs-horizontal">
                  <Tabs
                    items={operatorProfileTabs}
                    location={location}
                    params={params}
                  />
                  <div className="tab-content padding-vertical-20">
                    {children}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}

OperatorProfileLayout.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
  location: PropTypes.string,
  children: PropTypes.node,
  data: PropTypes.object,
};
