import { PropTypes } from 'react';

PropTypes.price = PropTypes.shape({
  amount: PropTypes.number,
  currency: PropTypes.string,
});
PropTypes.pageable = content => PropTypes.shape({
  first: PropTypes.bool.isRequired,
  last: PropTypes.bool.isRequired,
  number: PropTypes.number.isRequired,
  numberOfElements: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  sort: PropTypes.array,
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

export default PropTypes;
