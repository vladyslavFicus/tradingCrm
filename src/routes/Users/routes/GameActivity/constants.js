import keyMirror from 'keymirror';

const actions = keyMirror({
  StopGameSessionEvent: null,
  StartGameSessionEvent: null,
  BetPlacedEvent: null,
  WinCollectedEvent: null,
});
const actionsLabels = {
  [actions.StopGameSessionEvent]: 'Stop Game',
  [actions.StartGameSessionEvent]: 'Start Game',
  [actions.BetPlacedEvent]: 'Bet',
  [actions.WinCollectedEvent]: 'Win',
};

export {
  actions,
  actionsLabels,
};
