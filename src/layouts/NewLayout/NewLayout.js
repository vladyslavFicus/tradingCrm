import React, { Component } from 'react';
import PropTypes from '../../constants/propTypes';
import { sidebarTopMenu, sidebarBottomMenu } from '../../config/menu';
import LayoutHeader from '../../components/LayoutHeader';
import Sidebar from '../../components/Sidebar';
import UsersPanel from '../../components/UsersPanel';
import './NewLayout.scss';

class NewLayout extends Component {
  static propTypes = {
    children: PropTypes.any,
  };

  state = {
    hasTabs: false,
  };

  handleCloseTabs = () => {
    this.setState({ hasTabs: false });
  };

  render() {
    const { children } = this.props;

    return (
      <div>
        <LayoutHeader />
        <Sidebar
          topMenu={sidebarTopMenu}
          bottomMenu={sidebarBottomMenu}
        />
        {this.renderSection(children) }
        <UsersPanel
          items={[
            { fullName: 'John Doe', login: 'johndoe', uuid: 'PL-12312315', color: 'purple' },
            { fullName: 'John Doe', login: 'johndoe', uuid: 'PL-12312312', color: 'green' },
            { fullName: 'John Doe', login: 'johndoe', uuid: 'PL-12312314', color: 'blue' },
            { fullName: 'John Doe', login: 'johndoe', uuid: 'PL-12312313', color: 'orange' },
            { fullName: 'John Doe', login: 'johndoe', uuid: 'PL-12312316', color: 'pink' },
          ]}
          onClose={this.handleCloseTabs}
        />
      </div>
    );
  }

  renderSection = children => (
    <section>
      <div className="section-container">
        {children}
      </div>
    </section>
  )
}

export default NewLayout;
