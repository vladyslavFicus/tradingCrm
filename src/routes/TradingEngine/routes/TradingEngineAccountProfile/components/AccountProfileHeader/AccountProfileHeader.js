import React, { PureComponent } from 'react';
import { Button } from 'components/UI';
import Uuid from 'components/Uuid';
import './AccountProfileHeader.scss';

class AccountProfileHeader extends PureComponent {
  render() {
    return (
      <div className="AccountProfileHeader">
        <div className="AccountProfileHeader__topic">
          <div className="AccountProfileHeader__title">
            <div>123-412-123</div>
            <div>Vasya Pupkin</div>
          </div>

          <div className="AccountProfileHeader__uuid">
            <Uuid uuid="UUID-TEST-NUMBER" uuidPrefix="AC" />
          </div>
        </div>

        <div className="AccountProfileHeader__actions">
          <Button
            className="AccountProfileHeader__action"
            onClick={() => {}}
            commonOutline
            small
          >
            New order
          </Button>

          <Button
            className="AccountProfileHeader__action"
            onClick={() => {}}
            commonOutline
            small
          >
            Deposit
          </Button>

          <Button
            className="AccountProfileHeader__action"
            onClick={() => {}}
            commonOutline
            small
          >
            Credit
          </Button>
        </div>
      </div>
    );
  }
}

export default AccountProfileHeader;
