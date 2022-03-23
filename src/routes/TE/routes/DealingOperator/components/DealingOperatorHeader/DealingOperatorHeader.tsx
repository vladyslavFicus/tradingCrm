import React from 'react';
import I18n from 'i18n-js';
import permissions from 'config/permissions';
import PermissionContent from 'components/PermissionContent';
import { Button } from 'components/UI';
import Uuid from 'components/Uuid';
import { Operator } from '../../DealingOperator';
import './DealingOperatorHeader.scss';

type Props = {
  operator: Operator,
}

const DealingOperatorHeader = ({ operator }: Props) => {
  const { status, firstName, lastName, uuid } = operator;

  return (
    <div className="DealingOperatorHeader">
      <div className="DealingOperatorHeader__topic">
        <div className="DealingOperatorHeader__title">{`${firstName} ${lastName}`}</div>
        <div className="DealingOperatorHeader__uuid">
          <Uuid uuid={uuid} />
        </div>
      </div>

      <div className="DealingOperatorHeader__actions">
        <PermissionContent permissions={permissions.WE_TRADING.OPERATORS_UNLOCK}>
          <If condition={status !== 'CLOSED'}>
            <Button
              className="DealingOperatorHeader__action"
              onClick={() => console.log('not implemented')}
              primary
              small
            >
              {I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.UNLOCK')}
            </Button>
          </If>
        </PermissionContent>

        <If condition={status === 'ACTIVE'}>
          <PermissionContent permissions={permissions.WE_TRADING.OPERATORS_RESET_PASSWORD}>
            <Button
              className="DealingOperatorHeader__action"
              onClick={() => console.log('not implemented')}
              primary
              small
            >
              {I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.RESET_PASSWORD')}
            </Button>
          </PermissionContent>
        </If>

        <PermissionContent permissions={permissions.WE_TRADING.OPERATORS_CHANGE_PASSWORD}>
          <Button
            className="DealingOperatorHeader__action"
            onClick={() => console.log('not implemented')}
            primary
            small
          >
            {I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.CHANGE_PASSWORD')}
          </Button>
        </PermissionContent>
      </div>
    </div>
  );
};

export default React.memo(DealingOperatorHeader);
