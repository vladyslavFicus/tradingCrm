import React from 'react';
import { shallow } from 'enzyme';
import PlayerMiniProfile from '../../../src/components/MiniProfile/PlayerMiniProfile';
import { currencyCodes } from '../../../src/components/Amount/constants';
import Uuid from '../../../src/components/Uuid';
import { statuses as userStatuses } from '../../../src/constants/user';

describe('(Component) PlayerMiniProfile', () => {
  let _props, _wrapper;

  const playerUUID = 'PLAYER-3fd80a6e-931d-43b4-9f71-e639b9ea8045';

  const playerUUIDContainer = <Uuid uuid={playerUUID} />;

  beforeEach(() => {
    _props = {
      data: {
        signInIps: [],
        profileStatus: userStatuses.ACTIVE,
        username: "",
        playerUUID,
        profileStatusReason: "",
        kycCompleted: false,
        balances: {
          bonus: { amount: 0, currency: currencyCodes.EUR },
          real: { amount: 0, currency: currencyCodes.EUR },
          total: { amount: 0, currency: currencyCodes.EUR },
          withdrawable: { amount: 0, currency: currencyCodes.EUR },
        },
        tags: [
          {id: 14430, priority: 'neutral', tag: 'tag2'},
          {id: 14431, priority: 'negative', tag: 'tag2'},
        ],
      }
    };
    _wrapper = shallow(<PlayerMiniProfile {..._props} />);
  });

  it('renders as a <div>.', () => {
    expect(_wrapper.is('div')).to.equal(true);
  });

  it('renders check icon when kyc is completed', () => {
    _props = {
      data: {
        ..._props.data,
        kycCompleted: true,
      }
    }
    _wrapper = shallow(<PlayerMiniProfile {..._props} />);
    expect(_wrapper.find('i.fa.fa-check')).to.exist();
  });

  it('do not renders check icon when kyc is not completed', () => {
    _wrapper = shallow(<PlayerMiniProfile {..._props} />);
    expect(_wrapper.find('i.fa.fa-check')).to.not.exist();
  });

  it('renders with tags passed by prop "data.tags"', () => {
    _props.data.tags.map(tag => {
      expect(_wrapper.find(`span.mini-profile-tag_${tag.priority}`)).to.exist();
    })
  });

  it('renders reason according to player status', () => {
    _props = {
      data: {
        ..._props.data,
        profileStatus: userStatuses.BLOCKED
      }
    };
    _wrapper = shallow(<PlayerMiniProfile {..._props} />);
    expect(_wrapper.find('div.info-block_status-reason_body')).to.exist();

    _props = {
      data: {
        ..._props.data,
        profileStatus: userStatuses.SUSPENDED
      }
    };
    _wrapper = shallow(<PlayerMiniProfile {..._props} />);
    expect(_wrapper.find('div.info-block_status-reason_body')).to.exist();
  });

  it('renders with UUID', () => {
    expect(_wrapper).to.contain(playerUUIDContainer);
  });

  it('do not renders UUID', () => {
    _props = {
      data: {
        ..._props.data,
        playerUUID: null,
      }
    };
    _wrapper = shallow(<PlayerMiniProfile {..._props} />);

    expect(_wrapper).to.not.contain(playerUUIDContainer);
  });
});