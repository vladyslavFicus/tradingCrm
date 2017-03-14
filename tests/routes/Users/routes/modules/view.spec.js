import reducer, {
  initialState
} from '../../../../../src/routes/Users/modules/view';

const getCurrentState = () => ({ ...initialState });

describe('Users::View - Redux', () => {
  describe('Initial state', () => {
    it('Should not be an undefined', () => {
      expect(initialState).to.not.equal(undefined);
    });
  });

  describe('Reducer', () => {
    it('Should return initial state when initialize reducer', () => {
      const newState = reducer(undefined, {});

      expect(newState).to.deep.equal(initialState);
    });

    it('Should return same state after unknown action', () => {
      const newState = reducer(getCurrentState(), { type: 'unknown' });

      expect(newState).to.deep.equal(getCurrentState());
    });
  });
});
