import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import './HideDetails.scss';

class HideDetails extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  state = {
    collapsed: false,
  };

  handleCollapseBlock = () => {
    this.setState(({ collapsed }) => ({ collapsed: !collapsed }));
  };

  render() {
    const { children } = this.props;
    const { collapsed } = this.state;

    return (
      <Fragment>
        <div className="row no-gutters hide-details">
          <div className="col hide-details__divider" />
          <button
            type="button"
            className="col-auto px-3 btn-transparent hide-details__action"
            onClick={this.handleCollapseBlock}
          >
            <Choose>
              <When condition={collapsed}>
                {I18n.t('COMMON.DETAILS_COLLAPSE.SHOW')}
              </When>
              <Otherwise>
                {I18n.t('COMMON.DETAILS_COLLAPSE.HIDE')}
              </Otherwise>
            </Choose>
          </button>
          <div className="col hide-details__divider" />
        </div>
        <Collapse isOpen={!collapsed}>
          {children}
        </Collapse>
      </Fragment>
    );
  }
}

export default HideDetails;
