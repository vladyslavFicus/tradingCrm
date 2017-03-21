import React, { Component, PropTypes } from 'react';
import { Button } from 'reactstrap';
import { shortify } from 'utils/uuid';
import './Header.scss';

export default class Header extends Component {
  render() {
    const {
      operatorProfile: {
        operatorId,
        firstName,
        lastName,
        country,
      },
      onResetPasswordClick,
    } = this.props;

    return (
      <div className="operator-profile-header">
        <div className="row panel-heading">
          <div className="operator-profile-info">
            <h3 className="operator-profile-info-name">{`${firstName} ${lastName}`}</h3>
            <span className="operator-profile-info-id">
              {`${shortify(operatorId, 'OP')} - ${country}`}
            </span>
          </div>
          <div className="operator-profile-actions">
            <Button className="operator-profile-actions-button btn-default-outline">Send Invitation</Button>
            <Button
              className="operator-profile-actions-button btn-default-outline"
              onClick={onResetPasswordClick}
            >Reset Password</Button>
          </div>
        </div>
        <div className="row panel-heading header-blocks">
          <div className="header-block width-33">
            <div className="header-block-title">Account</div>
            <div className="header-block-text">Lorem ipsum dolor sit</div>
            <div className="header-block-secondary-text">Lorem ipsum dolor</div>
          </div>
          <div className="header-block width-33">
            <div className="header-block-title">Account</div>
            <div className="header-block-text">Lorem ipsum dolor sit</div>
            <div className="header-block-secondary-text">Lorem ipsum dolor</div>
          </div>
          <div className="header-block width-33">
            <div className="header-block-title">Account</div>
            <div className="header-block-text">Lorem ipsum dolor sit</div>
            <div className="header-block-secondary-text">Lorem ipsum dolor</div>
          </div>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  operatorProfile: PropTypes.object,
  onResetPasswordClick: PropTypes.func.isRequired,
};
