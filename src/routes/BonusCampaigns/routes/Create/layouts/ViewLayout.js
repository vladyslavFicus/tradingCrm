import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { Collapse } from 'reactstrap';
import Tabs from '../../../../../components/Tabs';
import PropTypes from '../../../../../constants/propTypes';
import Header from '../components/Header';
import Information from '../components/Information';
import ConfirmActionModal from '../../../../../components/Modal/ConfirmActionModal';

const REMOVE_PLAYERS = 'remove-players-modal';
const modalInitialState = {
  name: null,
  params: {},
};
const CREATE_PAGE_TABS = [
  { label: 'Settings', url: '/bonus-campaigns/create/settings' },
  { label: 'Feed', url: '/bonus-campaigns/create/feed' },
];

class ViewLayout extends Component {
  static propTypes = {
    location: PropTypes.object,
    children: PropTypes.node,
  };
  static defaultProps = {
    availableStatusActions: [],
  };
  static contextTypes = {
    addNotification: PropTypes.func.isRequired,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  state = {
    informationShown: true,
    modal: { ...modalInitialState },
  };

  handleOpenModal = (name, params) => {
    this.setState({
      modal: {
        name,
        params,
      },
    });
  };

  handleCloseModal = (cb) => {
    this.setState({ modal: { ...modalInitialState } }, () => {
      if (typeof cb === 'function') {
        cb();
      }
    });
  };

  handleToggleInformationBlock = () => {
    this.setState({ informationShown: !this.state.informationShown });
  };

  render() {
    const { informationShown, modal } = this.state;
    const {
      location,
      children,
    } = this.props;

    return (
      <div className="layout layout_not-iframe">
        <div className="layout-info">
          <Header />

          <div className="hide-details-block">
            <div className="hide-details-block_divider" />
            <button
              className="hide-details-block_text btn-transparent"
              onClick={this.handleToggleInformationBlock}
            >
              {informationShown ?
                I18n.t('COMMON.DETAILS_COLLAPSE.HIDE') :
                I18n.t('COMMON.DETAILS_COLLAPSE.SHOW')
              }
            </button>
            <div className="hide-details-block_divider" />
          </div>

          <Collapse isOpen={informationShown}>
            <Information />
          </Collapse>
        </div>

        <div className="layout-content">
          <div className="nav-tabs-horizontal">
            <Tabs
              items={CREATE_PAGE_TABS}
              location={location}
            />
            {children}
          </div>
        </div>
        {
          modal.name === REMOVE_PLAYERS &&
          <ConfirmActionModal
            onSubmit={this.handleRemovePlayers}
            onClose={this.handleCloseModal}
            modalTitle={I18n.t('BONUS_CAMPAIGNS.REMOVE_PLAYERS.BUTTON')}
            actionText={I18n.t('BONUS_CAMPAIGNS.REMOVE_PLAYERS.MODAL_TEXT')}
          />
        }
      </div>
    );
  }
}

export default ViewLayout;
