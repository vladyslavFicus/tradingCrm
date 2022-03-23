import { TradingEngine__OperatorStatuses__Enum as OperatorStatusesEnum } from '__generated__/types';

export const statusActions: Record<string, [{ action: string, label: string, reasons: string[] }]> = {
  ACTIVE:
    [{
      action: OperatorStatusesEnum.CLOSED,
      label: 'OPERATORS.STATUSES.CLOSED',
      reasons: [
        'TRADING_ENGINE.OPERATOR_PROFILE.CLOSE_REASONS.PENDING_INVESTIGATION',
        'TRADING_ENGINE.OPERATOR_PROFILE.CLOSE_REASONS.TERMINATED',
      ],
    }],
  CLOSED:
    [{
      action: OperatorStatusesEnum.ACTIVE,
      label: 'OPERATORS.STATUSES.INACTIVE',
      reasons: [
        'TRADING_ENGINE.OPERATOR_PROFILE.ACTIVATE_REASONS.ACTIVATE',
      ],
    }],
};

export const statusesLabels: Record<string, { label: string, color: string }> = {
  INACTIVE: { label: 'TRADING_ENGINE.OPERATORS.STATUSES.INACTIVE', color: 'color-info' },
  CLOSED: { label: 'TRADING_ENGINE.OPERATORS.STATUSES.CLOSED', color: 'color-danger' },
  ACTIVE: { label: 'TRADING_ENGINE.OPERATORS.STATUSES.ACTIVE', color: 'color-success' },
};
