import React from 'react';
import ReactPlaceholder from 'react-placeholder';
import { TextRow } from 'react-placeholder/lib/placeholders';
import './Placeholder.scss';

type Props = {
  children: React.ReactElement,
  ready: boolean,
  rows: Array<{ width: number, height: number }>,
};

const Placeholder = (props: Props) => {
  const {
    children,
    ready,
    rows,
  } = props;

  return (
    <ReactPlaceholder
      showLoadingAnimation
      ready={ready}
      customPlaceholder={(
        <div>
          {rows.map((row, index) => (
            <TextRow
              key={`row-${index}`}
              className="Placeholder__text-row"
              style={{
                width: `${row.width}px`,
                height: `${row.height}px`,
              }}
            />
          ))}
        </div>
      )}
    >
      {children}
    </ReactPlaceholder>
  );
};

export default React.memo(Placeholder);
