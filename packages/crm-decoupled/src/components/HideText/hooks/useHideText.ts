import { useEffect, useRef, useState } from 'react';
import { v4 } from 'uuid';

const useHideText = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  const ref = useRef<HTMLParagraphElement | null>(null);

  const id = `hideText-${v4()}`;

  useEffect(() => {
    const paragraph = ref.current;

    if (paragraph) {
      const isOverflow = paragraph.offsetWidth < paragraph.scrollWidth;
      setShowTooltip(isOverflow);
    }
  }, []);

  return { showTooltip, ref, id };
};

export default useHideText;
