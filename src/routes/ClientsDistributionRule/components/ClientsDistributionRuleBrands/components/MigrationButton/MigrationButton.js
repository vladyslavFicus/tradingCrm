import React, { PureComponent } from 'react';
import { Button } from 'components/UI';
import { ReactComponent as AddIcon } from './icon-add.svg';
import './MigrationButton.scss';

class MigrationButton extends PureComponent {
  render() {
    return (
      <Button
        className="MigrationButton"
        primary
        {...this.props}
      >
        <AddIcon className="MigrationButton__icon" />
        Add brand +
      </Button>
    );
  }
}

export default MigrationButton;
