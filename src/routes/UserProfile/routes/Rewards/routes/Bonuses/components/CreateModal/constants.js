import I18n from '../../../../../../../../utils/fake-i18n';
import { lockAmountStrategy } from '../../../../../../../../constants/bonus-campaigns';

const attributeLabels = {
  playerUUID: I18n.t('PLAYER_PROFILE.BONUS.MODAL_CREATE.LABELS.PLAYER_UUID'),
  label: I18n.t('PLAYER_PROFILE.BONUS.MODAL_CREATE.LABELS.LABEL'),
  priority: I18n.t('PLAYER_PROFILE.BONUS.MODAL_CREATE.LABELS.PRIORITY'),
  moneyTypePriority: I18n.t('PLAYER_PROFILE.BONUS.MODAL_CREATE.LABELS.MONEY_TYPE_PRIORITY'),
  currency: I18n.t('PLAYER_PROFILE.BONUS.MODAL_CREATE.LABELS.CURRENCY'),
  state: I18n.t('PLAYER_PROFILE.BONUS.MODAL_CREATE.LABELS.STATE'),
  grantedAmount: I18n.t('PLAYER_PROFILE.BONUS.MODAL_CREATE.LABELS.GRANTED_AMOUNT'),
  amountToWage: I18n.t('PLAYER_PROFILE.BONUS.MODAL_CREATE.LABELS.AMOUNT_TO_WAGE'),
  createdDate: I18n.t('PLAYER_PROFILE.BONUS.MODAL_CREATE.LABELS.CREATED_DATE'),
  expirationDate: I18n.t('PLAYER_PROFILE.BONUS.MODAL_CREATE.LABELS.EXPIRATION_DATE'),
  prize: I18n.t('PLAYER_PROFILE.BONUS.MODAL_CREATE.LABELS.PRIZE'),
  capping: I18n.t('PLAYER_PROFILE.BONUS.MODAL_CREATE.LABELS.CAPPING'),
  optIn: I18n.t('PLAYER_PROFILE.BONUS.MODAL_CREATE.LABELS.OPT_IN'),
  converted: I18n.t('PLAYER_PROFILE.BONUS.MODAL_CREATE.LABELS.CONVERTED'),
  wagered: I18n.t('PLAYER_PROFILE.BONUS.MODAL_CREATE.LABELS.WAGERED'),
  lockAmountStrategy: I18n.t('PLAYER_PROFILE.BONUS.MODAL_CREATE.LABELS.LOCK_AMOUNT_STRATEGY'),
};

const lockAmountStrategyLabels = {
  [lockAmountStrategy.LOCK_ALL]: I18n.t('PLAYER_PROFILE.BONUS.MODAL_CREATE.LOCK_AMOUNT_STRATEGY.LOCK_ALL'),
  [lockAmountStrategy.LOCK_PARTIAL]: I18n.t('PLAYER_PROFILE.BONUS.MODAL_CREATE.LOCK_AMOUNT_STRATEGY.LOCK_PARTIAL'),
};

export {
  attributeLabels,
  lockAmountStrategyLabels,
};
