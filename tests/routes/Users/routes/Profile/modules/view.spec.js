import reducer, {
  actionTypes,
  actionCreators,
  initialState
} from '../../../../../../src/routes/Users/modules/view';

const getCurrentState = () => ({
  data: {
    id: null,
    username: null,
    email: null,
    currency: null,
    balance: null,
  },
  isLoading: false,
  isFailed: false,
  receivedAt: null,
});

describe('Users::View - Redux', () => {
  describe('Initial state', () => {
    it('Should not be an undefined', () => {
      expect(initialState).to.not.equal(undefined);
    });
  });

  describe('Reducer', () => {
    it('Should return initial state when initialize reducer', () => {
      const newState = reducer(undefined, {});

      expect(newState).to.equal(initialState);
    });

    it('Should return same state after unknown action', () => {
      const newState = reducer(getCurrentState(), { type: 'unknown' });

      expect(newState).to.deep.equal(getCurrentState());
    });
  });
});
