import reducer, {
  actionTypes,
  actionCreators,
  initialState
} from 'redux/modules/auth';

const getCurrentState = () => ({
  token: 'eyJzZXNzaW9uX3V1aWQiOiJmODA4YjljZC1hYzRiLTQ1NWQtYmE5OS02ZjdjYzBiNmM2MjQiLCJ0eXBlIjoiQkVBUkVSIiwiYWxnIjoiSFM1MTIifQ.eyJzdWIiOiJtYW5hZ2VyIiwidXNlcl91dWlkIjoiMDJmMjk4NzQtMTIyYy00ODVjLWE0MzQtZTAzNmE5ZTgwZTc5IiwiYXV0aG9yaXRpZXMiOlsiTUFOQUdFUiJdLCJpc3MiOiJOZXdBZ2VTb2wgQXV0aCBTZXJ2aWNlIiwiaWF0IjoxNDczMDY4Njc0LCJleHAiOjE0NzMwNjkyNzR9.Vve3jM4f-uxeUo0JLmLGQXoEYQi-bzF11vBnJFQr0gasSx6gcWT5wgQrMsxdz3N8H2bFqlAsO2ivHda6r6aRww',
  uuid: '02f29874-122c-485c-a434-e036a9e80e79',
  username: 'manager',
});

describe('Redux::Auth', () => {
  describe('Initial state', () => {
    it('Should not be an undefined', () => {
      expect(initialState).to.not.be.equal(undefined);
    });
  });

  describe('Reducer', () => {
    it('Should return initial state when initialize reducer', () => {
      const newState = reducer(undefined, {});

      expect(newState).to.be.eql(initialState);
    });

    it('Should return initial state on logout', () => {
      const newState = reducer(getCurrentState(), { type: actionTypes.LOGOUT.SUCCESS });

      expect(newState).to.be.eql(initialState);
    });
  });
});
