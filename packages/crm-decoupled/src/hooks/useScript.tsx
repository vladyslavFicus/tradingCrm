import { useEffect } from 'react';

type Props = {
  src?: string,
  options?: string,
}

type UseScript = {
  initScript: (props: Props) => Promise<void>,
}

const useScript = (scriptID: string): UseScript => {
  let script: HTMLScriptElement | null;

  const getScript = () => document.getElementById(scriptID) as HTMLScriptElement | null;

  const initScript = async (props: Props) => {
    const {
      src,
      options,
    } = props;

    script = document.createElement('script');
    script.async = true;
    if (src) script.src = src;
    if (options) script.innerHTML = options;
    getScript()?.appendChild(script);
  };

  useEffect(() => () => {
    if (script) {
      script.remove();
    }
  }, []);

  return {
    initScript,
  };
};

export default useScript;
