const customTimeout = (func, delay = 500) => {
  let timeout;

  const clearCustomTimeout = () => {
    clearTimeout(timeout);
  };

  const setCustomTimeout = (f) => {
    timeout = setTimeout(() => {
      f();
      clearCustomTimeout();
    }, delay);
  };

  setCustomTimeout(func);
};

export default customTimeout;
