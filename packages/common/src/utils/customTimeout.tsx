export default (func: Function, delay = 500) => {
  let timeout: ReturnType<typeof setTimeout>;

  const clearCustomTimeout = () => {
    clearTimeout(timeout);
  };

  const setCustomTimeout = (f: Function) => {
    timeout = setTimeout(() => {
      f();
      clearCustomTimeout();
    }, delay);
  };

  setCustomTimeout(func);
};
