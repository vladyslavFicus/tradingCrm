import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'reactstrap';
import I18n from 'i18n-js';
import './HideDetails.scss';

class HideDetails extends PureComponent {
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
        <div className="HideDetails">
          <div className="HideDetails__divider" />
          <button
            type="button"
            className="HideDetails__trigger"
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
          <div className="HideDetails__divider" />
        </div>
        <Collapse isOpen={!collapsed}>
          {children}
        </Collapse>
      </Fragment>
    );
  }
}

export default HideDetails;
