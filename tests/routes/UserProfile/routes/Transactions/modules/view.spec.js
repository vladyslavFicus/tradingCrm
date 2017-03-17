import reducer, {
  actionTypes,
  actionCreators,
  initialState
} from '../../../../../../src/routes/UserProfile/routes/Transactions/modules/view';

import { targetTypes } from 'constants/note';

const getCurrentState = () => ({...initialState});

const getFetchEntitiesSuccessAction = (pageNumber) => {
  return {
    type: actionTypes.FETCH_ENTITIES.SUCCESS,
    payload: {
      content: [1, 2, 3],
      number: pageNumber
    }
  };
};

describe('UserProfile::Transactions::view', () => {
  it('should return initial state when initialized', () => {
    const newState = reducer(undefined, {});

    expect(newState).to.deep.equal(initialState);
  });

  describe('Fetching entities', () => {
    it('should overwrite content when requested with page number 0', () => {
      const fetchEntitiesSuccessAction = getFetchEntitiesSuccessAction(0);
      const newState = reducer(getCurrentState(), fetchEntitiesSuccessAction);

      expect(newState.entities.content).to.deep.equal(fetchEntitiesSuccessAction.payload.content);
    });

    it('should add content when requested with non-zero page number', () => {
      const fetchEntitiesSuccessAction = getFetchEntitiesSuccessAction(1);
      let newState = reducer(getCurrentState(), fetchEntitiesSuccessAction);
      newState = reducer(newState, fetchEntitiesSuccessAction);

      const expectedResult = [
        ...fetchEntitiesSuccessAction.payload.content,
        ...fetchEntitiesSuccessAction.payload.content
      ];

      expect(newState.entities.content).to.deep.equal(expectedResult);
    });

    it('should return entities with mapped notes on success action', (done) => {
      const action = {type: actionTypes.FETCH_ENTITIES.SUCCESS, payload: {content: []}};
      const fetchNotesStub = sinon.spy();
      const dispatch = arg => Promise.resolve(action);

      const fetchEntitiesFn = actionCreators.fetchEntities({}, fetchNotesStub);
      const fetchEntitiesResult = fetchEntitiesFn(dispatch, () => ({auth: {}}));

      fetchEntitiesResult.then((r) => {
        expect(r).to.eql(action);
        expect(fetchNotesStub).to.have.been.calledWith(targetTypes.PAYMENT, sinon.match.array);
        done();
      });
    });
  });
});
