import React from 'react';
import './MiniProfileContentItem.scss';

type Props = {
  label: string,
  heading?: string,
  description: string | React.ReactNode,
}

const MiniProfileContentItem = (props: Props) => {
  const { label, heading, description } = props;

  return (
    <tr className="MiniProfileContentItem">
      <td className="MiniProfileContentItem__label">{label}</td>
      <td className="MiniProfileContentItem__content">
        <div className="MiniProfileContentItem__heading">{heading}</div>
        <div className="MiniProfileContentItem__description">{description}</div>
      </td>
    </tr>
  );
};

export default React.memo(MiniProfileContentItem);
