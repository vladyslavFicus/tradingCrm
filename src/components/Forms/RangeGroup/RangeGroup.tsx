import React from 'react';
import classNames from 'classnames';
import FieldLabel from '../FieldLabel';
import './RangeGroup.scss';

type Props = {
  children: Array<React.ReactNode>,
  label?: string,
  className?: string,
  dividerClassName?: string,
};

const RangeGroup = (props: Props) => {
  const {
    children,
    label,
    className,
    dividerClassName,
  } = props;

  const [fromElement, toElement] = React.Children.toArray(children);

  return (
    <div className={classNames('RangeGroup', className)}>
      <FieldLabel className="RangeGroup__label" label={label} />
      <div className="RangeGroup__container">
        <div>{fromElement}</div>
        <div className={classNames('RangeGroup__divider', dividerClassName)}>
          -
        </div>
        <div>{toElement}</div>
      </div>
    </div>
  );
};

export default React.memo(RangeGroup);
