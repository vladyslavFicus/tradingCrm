import { TradingEngine__OperatorStatuses__Enum as OperatorStatusesEnum } from '__generated__/types';

export const statusActions: Record<string, [{
  action: OperatorStatusesEnum,
  label: string,
  reasons: Record<string, string>,
}]> = {
  ACTIVE:
    [{
      action: OperatorStatusesEnum.CLOSED,
      label: 'TRADING_ENGINE.OPERATORS.STATUSES.CLOSED',
      reasons: {
        PENDING_INVESTIGATION: 'TRADING_ENGINE.OPERATOR_PROFILE.CLOSE_REASONS.PENDING_INVESTIGATION',
        TERMINATED: 'TRADING_ENGINE.OPERATOR_PROFILE.CLOSE_REASONS.TERMINATED',
      },
    }],
  CLOSED:
    [{
      action: OperatorStatusesEnum.ACTIVE,
      label: 'TRADING_ENGINE.OPERATORS.STATUSES.ACTIVE',
      reasons: {
        ACTIVATE: 'TRADING_ENGINE.OPERATOR_PROFILE.ACTIVATE_REASONS.ACTIVATE',
      },
    }],
};

export const statusesLabels: Record<string, string> = {
  ACTIVE: 'TRADING_ENGINE.OPERATORS.STATUSES.ACTIVE',
  INACTIVE: 'TRADING_ENGINE.OPERATORS.STATUSES.INACTIVE',
  CLOSED: 'TRADING_ENGINE.OPERATORS.STATUSES.CLOSED',
};
