export type PaymentTypeDetails = {
  name: string,
  permission: string,
}

export enum statuses {
  APPROVED = 'APPROVED',
  CANCELED = 'CANCELED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

export enum tradingStatuses {
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_REFUSED = 'PAYMENT_REFUSED',
  PAYMENT_CHARGEBACK = 'PAYMENT_CHARGEBACK',
  PAYMENT_COMPLETED = 'PAYMENT_COMPLETED',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  TRANSACTION_COMPLETED = 'TRANSACTION_COMPLETED',
  PAYMENT_CANCELED = 'PAYMENT_CANCELED',
  PAYMENT_APPROVED = 'PAYMENT_APPROVED',
}

export enum methods {
  CREDIT_CARD = 'CREDIT_CARD',
  PAYPAL = 'PAYPAL',
  PAYTRIO = 'PAYTRIO',
  SKRILL = 'SKRILL',
  ENFINS = 'ENFINS',
  CASHIER = 'CASHIER',
  VOGUEPAY = 'VOGUEPAY',
  CHARGEBACK = 'CHARGEBACK',
  CRYPTOCURRENCY_EXTERNAL = 'CRYPTOCURRENCY_EXTERNAL',
  B2CRYPTO = 'B2CRYPTO',
  PAYRETAILERS = 'PAYRETAILERS',
  WIRECAPITAL = 'WIRECAPITAL',
  EFTPAY = 'EFTPAY',
}

export enum aggregators {
  MANUAL = 'MANUAL',
  CASHIER = 'CASHIER',
  INTERNAL = 'INTERNAL',
}

export enum manualPaymentMethods {
  BONUS = 'BONUS',
  CHARGEBACK = 'CHARGEBACK',
  CREDIT_CARD = 'CREDIT_CARD',
  ELECTRONIC = 'ELECTRONIC',
  EXTERNAL = 'EXTERNAL',
  INTERNAL_TRANSFER = 'INTERNAL_TRANSFER',
  MIGRATION = 'MIGRATION',
  PAYRETAILERS = 'PAYRETAILERS',
  RECALL = 'RECALL',
  SYSTEM = 'SYSTEM',
  WIRE = 'WIRE',
  REFERRAL_BONUS = 'REFERRAL_BONUS',
}

export enum tradingTypes {
  CREDIT_IN = 'CREDIT_IN',
  CREDIT_OUT = 'CREDIT_OUT',
  DEPOSIT = 'DEPOSIT',
  INACTIVITY_FEE = 'INACTIVITY_FEE',
  INTEREST_RATE = 'INTEREST_RATE',
  TRANSFER_IN = 'TRANSFER_IN',
  TRANSFER_OUT = 'TRANSFER_OUT',
  WITHDRAW = 'WITHDRAW',
  COMMISSION = 'COMMISSION'
}

export const statusMapper: Record<statuses, Array<tradingStatuses>> = {
  [statuses.COMPLETED]: [
    tradingStatuses.PAYMENT_COMPLETED,
  ],
  [statuses.APPROVED]: [
    tradingStatuses.PAYMENT_APPROVED,
  ],
  [statuses.FAILED]: [
    tradingStatuses.PAYMENT_FAILED,
    tradingStatuses.TRANSACTION_FAILED,
  ],
  [statuses.PENDING]: [
    tradingStatuses.PAYMENT_PENDING,
  ],
  [statuses.REJECTED]: [tradingStatuses.PAYMENT_REFUSED],
  [statuses.CANCELED]: [tradingStatuses.PAYMENT_CANCELED],
};

export const tradingTypesLabels: Record<string, string> = {
  [tradingTypes.DEPOSIT]: 'COMMON.PAYMENT_TYPE.DEPOSIT',
  [tradingTypes.WITHDRAW]: 'COMMON.PAYMENT_TYPE.WITHDRAW',
  [tradingTypes.INTEREST_RATE]: 'COMMON.PAYMENT_TYPE.INTEREST_RATE',
  [tradingTypes.INACTIVITY_FEE]: 'COMMON.PAYMENT_TYPE.INACTIVITY_FEE',
  [tradingTypes.TRANSFER_IN]: 'COMMON.PAYMENT_TYPE.TRANSFER_IN',
  [tradingTypes.TRANSFER_OUT]: 'COMMON.PAYMENT_TYPE.TRANSFER_OUT',
  [tradingTypes.CREDIT_IN]: 'COMMON.PAYMENT_TYPE.CREDIT_IN',
  [tradingTypes.CREDIT_OUT]: 'COMMON.PAYMENT_TYPE.CREDIT_OUT',
  [tradingTypes.COMMISSION]: 'COMMON.PAYMENT_TYPE.COMMISSION',
  // Special type for transaction with type DEMO_DEPOSIT
  DEMO_DEPOSIT: 'COMMON.PAYMENT_TYPE.DEPOSIT',
  // Special type for transaction with type FEE
  FEE: 'COMMON.PAYMENT_TYPE.FEE',
};

export const statusesLabels: Record<statuses, string> = {
  [statuses.PENDING]: 'COMMON.PAYMENT_STATUS.PENDING',
  [statuses.APPROVED]: 'COMMON.PAYMENT_STATUS.APPROVED',
  [statuses.REJECTED]: 'COMMON.PAYMENT_STATUS.REJECTED',
  [statuses.CANCELED]: 'COMMON.PAYMENT_STATUS.CANCELED',
  [statuses.FAILED]: 'COMMON.PAYMENT_STATUS.FAILED',
  [statuses.COMPLETED]: 'COMMON.PAYMENT_STATUS.COMPLETED',
};

export const methodsLabels: Record<methods, string> = {
  [methods.SKRILL]: 'CONSTANTS.PAYMENT.PAYMENT_METHODS.SKRILL',
  [methods.PAYPAL]: 'CONSTANTS.PAYMENT.PAYMENT_METHODS.PAYPAL',
  [methods.CREDIT_CARD]: 'CONSTANTS.PAYMENT.PAYMENT_METHODS.CREDIT_CARD',
  [methods.PAYTRIO]: 'CONSTANTS.PAYMENT.PAYMENT_METHODS.PAYTRIO',
  [methods.CASHIER]: 'CONSTANTS.PAYMENT.PAYMENT_METHODS.CASHIER',
  [methods.CRYPTOCURRENCY_EXTERNAL]: 'CONSTANTS.PAYMENT.PAYMENT_METHODS.CRYPTOCURRENCY_EXTERNAL',
  [methods.ENFINS]: 'CONSTANTS.PAYMENT.PAYMENT_METHODS.ENFINS',
  [methods.CHARGEBACK]: 'CONSTANTS.PAYMENT.PAYMENT_METHODS.CHARGEBACK',
  [methods.VOGUEPAY]: 'CONSTANTS.PAYMENT.PAYMENT_METHODS.VOGUEPAY',
  [methods.B2CRYPTO]: 'CONSTANTS.PAYMENT.PAYMENT_METHODS.B2CRYPTO',
  [methods.PAYRETAILERS]: 'CONSTANTS.PAYMENT.PAYMENT_METHODS.PAYRETAILERS',
  [methods.WIRECAPITAL]: 'CONSTANTS.PAYMENT.PAYMENT_METHODS.WIRECAPITAL',
  [methods.EFTPAY]: 'CONSTANTS.PAYMENT.PAYMENT_METHODS.EFTPAY',
};

export const aggregatorsLabels: Record<aggregators, string> = {
  [aggregators.MANUAL]: 'CONSTANTS.PAYMENT.PAYMENT_AGGREGATORS.MANUAL',
  [aggregators.CASHIER]: 'CONSTANTS.PAYMENT.PAYMENT_AGGREGATORS.CASHIER',
  [aggregators.INTERNAL]: 'CONSTANTS.PAYMENT.PAYMENT_AGGREGATORS.INTERNAL',
};

export const manualPaymentMethodsLabels: Record<manualPaymentMethods, string> = {
  [manualPaymentMethods.SYSTEM]: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.SYSTEM',
  [manualPaymentMethods.CREDIT_CARD]: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.CREDIT_CARD',
  [manualPaymentMethods.WIRE]: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.WIRE',
  [manualPaymentMethods.EXTERNAL]: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.EXTERNAL',
  [manualPaymentMethods.MIGRATION]: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.MIGRATION',
  [manualPaymentMethods.INTERNAL_TRANSFER]: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.INTERNAL_TRANSFER',
  [manualPaymentMethods.ELECTRONIC]: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.ELECTRONIC',
  [manualPaymentMethods.BONUS]: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.BONUS',
  [manualPaymentMethods.PAYRETAILERS]: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.PAYRETAILERS',
  [manualPaymentMethods.RECALL]: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.RECALL',
  [manualPaymentMethods.CHARGEBACK]: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.CHARGEBACK',
  [manualPaymentMethods.REFERRAL_BONUS]: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.REFERRAL_BONUS',
};
