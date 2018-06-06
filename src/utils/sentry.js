export default {
  setExtraContext: (...args) => {
    if (window.Raven) {
      window.Raven.setExtraContext(...args);
    }
  },
  setUserContext: (...args) => {
    if (window.Raven) {
      window.Raven.setUserContext(...args);
    }
  },
  captureException: (...args) => {
    if (window.Raven) {
      window.Raven.captureException(...args);
    }
  },
  captureMessage: (...args) => {
    if (window.Raven) {
      window.Raven.captureMessage(...args);
    }
  },
};
