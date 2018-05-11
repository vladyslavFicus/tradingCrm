import React, { Component } from 'react';
import { Collapse } from 'reactstrap';
import Header from '../components/Header';
import Information from '../components/Information';
import Settings from '../components/Settings';
import HideDetails from '../../../../../components/HideDetails';

class ViewLayout extends Component {
  state = {
    informationShown: true,
  };

  handleToggleInformationBlock = () => {
    this.setState({ informationShown: !this.state.informationShown });
  };

  render() {
    const { informationShown } = this.state;

    return (
      <div className="profile">
        <div className="profile__info">
          <Header />
          <HideDetails
            onClick={this.handleToggleInformationBlock}
            informationShown={informationShown}
          />
          <Collapse isOpen={informationShown}>
            <Information />
          </Collapse>
        </div>
        <Settings />
      </div>
    );
  }
}

export default ViewLayout;
