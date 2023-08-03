import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import useHideText from 'components/HideText/hooks/useHideText';
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

  const { showTooltip, ref, id } = useHideText();

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
