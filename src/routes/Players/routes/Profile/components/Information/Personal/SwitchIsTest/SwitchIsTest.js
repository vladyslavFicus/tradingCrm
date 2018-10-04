import React, { PureComponent } from 'react';
import { get } from 'lodash';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../../constants/propTypes';
import Switch from '../../../../../../../../components/Forms/Switch';
import Permissions from '../../../../../../../../utils/permissions';
import permissions from '../../../../../../../../config/permissions';

const markIsTestPermissions = new Permissions(permissions.USER_PROFILE.MARK_IS_TEST);

class SwitchIsTest extends PureComponent {
  static propTypes = {
    profile: PropTypes.shape({
      playerProfile: PropTypes.shape({
        data: PropTypes.shape({
          isTest: PropTypes.bool,
          playerUUID: PropTypes.string,
        }),
      }),
    }),
    markIsTest: PropTypes.func.isRequired,
  };
  static contextTypes = {
    permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  };
  static defaultProps = {
    profile: {},
  };

  handleSwitchIsTest = async (isTest) => {
    const {
      profile: { playerProfile: { data: { playerUUID } } },
      markIsTest,
      notify,
    } = this.props;

    const response = await markIsTest({ variables: { playerUUID, isTest } });

    const error = get(response, 'data.profile.markIsTest.error');

    notify({
      level: error ? 'error' : 'success',
      title: isTest
        ? I18n.t('PLAYER_PROFILE.NOTIFICATIONS.SET_PLAYER_AS_TEST')
        : I18n.t('PLAYER_PROFILE.NOTIFICATIONS.UN_SET_PLAYER_AS_TEST'),
    });
  };

  render() {
    const { props: { profile } } = this;

    if (!markIsTestPermissions.check(this.context.permissions)) {
      return null;
    }

    const isTest = get(profile, 'playerProfile.data.isTest', false);

    return (
      <div className="font-size-13">
        <span className="font-weight-700">{I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.TEST_PLAYER')}:</span>
        <div className="float-right">
          <Switch
            active={isTest}
            handleSwitch={this.handleSwitchIsTest}
          />
        </div>
      </div>
    );
  }
}

export default SwitchIsTest;
