import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { withApollo } from '@apollo/client/react/hoc';
import compose from 'compose-function';
import { parseErrors, withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import { notify, LevelType } from 'providers/NotificationProvider';
import { Button } from 'components/UI';
import UnarchiveAccountMutation from './graphql/UnarchiveAccountMutation';

class UnarchiveButton extends PureComponent {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    unarchiveAccount: PropTypes.func.isRequired,
    client: PropTypes.shape({
      query: PropTypes.func.isRequired,
      mutate: PropTypes.func.isRequired,
    }).isRequired,
  };

  unarchiveAccount = async () => {
    const { uuid, unarchiveAccount } = this.props;

    try {
      await unarchiveAccount({
        variables: { uuid },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('TRADING_ACCOUNTS.GRID.UNARCHIVE.SUCCESS', { uuid }),
      });
    } catch (e) {
      const err = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.ERROR'),
        message: (err.error === 'error.account.not.archived' || err.error === 'error.account.unarchive.in-progress')
          ? err.message : I18n.t('COMMON.FAIL'),
      });
    }
  }

  render() {
    return (
      <Button tertiary onClick={this.unarchiveAccount}>
        {I18n.t('TRADING_ACCOUNTS.GRID.UNARCHIVE.BUTTON')}
      </Button>
    );
  }
}

export default compose(
  withApollo,
  withRequests({
    unarchiveAccount: UnarchiveAccountMutation,
  }),
)(UnarchiveButton);
