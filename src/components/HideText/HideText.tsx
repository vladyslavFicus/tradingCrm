import React, { useEffect, useRef, useState } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { v4 } from 'uuid';
import './HideText.scss';

type Props = {
  text: string,
  width?: string,
};

const HideText = (props: Props) => {
  const {
    text,
    width = 200,
  } = props;

  const [showTooltip, setShowTooltip] = useState(false);

  const id = `hideText-${v4()}`;
  const ref = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const paragraph = ref.current;

    if (paragraph) {
      const isOverflow = paragraph.offsetWidth < paragraph.scrollWidth;
      setShowTooltip(isOverflow);
    }
  }, []);

  return (
    <>
      <p
        id={id}
        ref={ref}
        className="HideText"
        style={{ maxWidth: `${width}px` }}
      >
        {text}
      </p>

      <If condition={showTooltip}>
        <UncontrolledTooltip
          placement="bottom"
          target={id}
          delay={{ show: 0, hide: 0 }}
          fade={false}
        >
          {text}
        </UncontrolledTooltip>
      </If>
    </>
  );
};

export default React.memo(HideText);
