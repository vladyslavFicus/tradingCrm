import { PropTypes } from 'react';
import { types as limitTypes } from '../constants/limits';

PropTypes.price = PropTypes.shape({
  amount: PropTypes.number,
  currency: PropTypes.string,
});
PropTypes.status = PropTypes.shape({
  author: PropTypes.string,
  comment: PropTypes.string,
  editDate: PropTypes.string,
  reason: PropTypes.string,
  value: PropTypes.string,
});
PropTypes.pageable = content => PropTypes.shape({
  first: PropTypes.bool.isRequired,
  last: PropTypes.bool.isRequired,
  number: PropTypes.number.isRequired,
  numberOfElements: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  sort: PropTypes.arrayOf(PropTypes.shape({
    ascending: PropTypes.bool.isRequired,
    direction: PropTypes.string.isRequired,
    ignoreCase: PropTypes.bool.isRequired,
    nullHandling: PropTypes.string.isRequired,
    property: PropTypes.string.isRequired,
  })),
  totalElements: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  content: PropTypes.arrayOf(content).isRequired,
});
PropTypes.pageableState = content => PropTypes.shape({
  entities: PropTypes.pageable(content).isRequired,
  isLoading: PropTypes.bool.isRequired,
  receivedAt: PropTypes.number,
  error: PropTypes.object,
});
PropTypes.ipEntity = PropTypes.shape({
  agent: PropTypes.string.isRequired,
  signInDate: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  ipAddress: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
});
PropTypes.noteEntity = PropTypes.shape({
  content: PropTypes.string.isRequired,
  creationDate: PropTypes.string.isRequired,
  creatorUUID: PropTypes.string.isRequired,
  lastEditionDate: PropTypes.string.isRequired,
  lastEditorUUID: PropTypes.string.isRequired,
  pinned: PropTypes.bool.isRequired,
  playerUUID: PropTypes.string.isRequired,
  targetType: PropTypes.string.isRequired,
  targetUUID: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
});
PropTypes.gamingActivityEntity = PropTypes.shape({
  betDate: PropTypes.string,
  bonusBetAmount: PropTypes.price,
  bonusWinAmount: PropTypes.price,
  gameId: PropTypes.string.isRequired,
  gameProviderId: PropTypes.string.isRequired,
  gameRoundId: PropTypes.string.isRequired,
  gameSessionId: PropTypes.string.isRequired,
  gameType: PropTypes.string.isRequired,
  playerUUID: PropTypes.string.isRequired,
  realBetAmount: PropTypes.price,
  realWinAmount: PropTypes.price,
  totalBetAmount: PropTypes.price,
  totalWinAmount: PropTypes.price,
  winDate: PropTypes.string,
});
PropTypes.limitEntity = PropTypes.shape({
  author: PropTypes.string.isRequired,
  creationDate: PropTypes.string.isRequired,
  expirationDate: PropTypes.any,
  period: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
  ]),
  playerUUID: PropTypes.string.isRequired,
  startDate: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
  status: PropTypes.string.isRequired,
  statusAuthor: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
  value: PropTypes.shape({
    type: PropTypes.string.isRequired,
    limit: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
    ]),
    left: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
    ]),
    used: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
    ]),
  }).isRequired,
});
PropTypes.fileEntity = PropTypes.shape({
  author: PropTypes.string,
  category: PropTypes.string,
  name: PropTypes.string,
  playerUuid: PropTypes.string,
  realName: PropTypes.string,
  status: PropTypes.status,
  type: PropTypes.string,
  uploadDate: PropTypes.string,
  uuid: PropTypes.string,
});
PropTypes.userProfile = PropTypes.shape({
  acceptedTermsId: PropTypes.number,
  address: PropTypes.string,
  addressKycMetaData: PropTypes.arrayOf(PropTypes.fileEntity),
  addressStatus: PropTypes.status,
  affiliateId: PropTypes.string,
  birthDate: PropTypes.string,
  btag: PropTypes.string,
  city: PropTypes.string,
  completed: PropTypes.bool,
  country: PropTypes.string,
  email: PropTypes.string,
  firstName: PropTypes.string,
  gender: PropTypes.string,
  id: PropTypes.number,
  identifier: PropTypes.any,
  kycCompleted: PropTypes.bool,
  kycStatus: PropTypes.string,
  kycStatusReason: PropTypes.string,
  languageCode: PropTypes.string,
  lastName: PropTypes.string,
  marketingMail: PropTypes.bool,
  marketingNews: PropTypes.bool,
  marketingSMS: PropTypes.bool,
  personalKycMetaData: PropTypes.arrayOf(PropTypes.fileEntity),
  personalStatus: PropTypes.status,
  phoneNumber: PropTypes.string,
  phoneNumberVerified: PropTypes.bool,
  postCode: PropTypes.string,
  profileStatus: PropTypes.string,
  profileStatusComment: PropTypes.any,
  profileStatusReason: PropTypes.string,
  profileTags: PropTypes.arrayOf(PropTypes.any),
  registrationDate: PropTypes.string,
  registrationIP: PropTypes.string,
  suspendEndDate: PropTypes.any,
  title: PropTypes.string,
  token: PropTypes.string,
  tokenExpirationDate: PropTypes.string,
  username: PropTypes.string,
  uuid: PropTypes.string,
});
PropTypes.authorityEntity = PropTypes.shape({
  id: PropTypes.number.isRequired,
  department: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
});
PropTypes.operatorProfile = PropTypes.shape({
  authorities: PropTypes.arrayOf(PropTypes.authorityEntity).isRequired,
  country: PropTypes.any,
  email: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  operatorStatus: PropTypes.string.isRequired,
  phoneNumber: PropTypes.string.isRequired,
  registrationDate: PropTypes.string.isRequired,
  statusChangeAuthor: PropTypes.any,
  statusChangeDate: PropTypes.any,
  uuid: PropTypes.string.isRequired,
});
PropTypes.limitPeriodEntity = PropTypes.shape({
  [limitTypes.DEPOSIT]: PropTypes.arrayOf(PropTypes.string).isRequired,
  [limitTypes.SESSION_DURATION]: PropTypes.arrayOf(PropTypes.string).isRequired,
  [limitTypes.LOSS]: PropTypes.arrayOf(PropTypes.string).isRequired,
  [limitTypes.WAGER]: PropTypes.arrayOf(PropTypes.string).isRequired,
});
PropTypes.navItem = PropTypes.shape({
  icon: PropTypes.string,
  label: PropTypes.string.isRequired,
  url: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.navItem),
});

export default PropTypes;
