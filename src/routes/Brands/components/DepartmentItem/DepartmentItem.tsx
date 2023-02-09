import React from 'react';
import I18n from 'i18n-js';
import './DepartmentItem.scss';

type Props = {
  department: string,
  role: string,
  onClick: () => void,
};

const DepartmentItem = (props: Props) => {
  const { department, role, onClick } = props;

  return (
    <div className="DepartmentItem" onClick={onClick}>
      <img
        src={`/img/departments/${department}.svg`}
        onError={(e) => { e.currentTarget.src = '/img/image-placeholder.svg'; }}
        className="DepartmentItem__image"
        alt={`${department} / ${role}`}
      />

      <div className="DepartmentItem__head">
        <div className="DepartmentItem__title">
          {I18n.t(`CONSTANTS.OPERATORS.DEPARTMENTS.${department}`, { defaultValue: department })}
        </div>

        <div className="DepartmentItem__role">
          {I18n.t(`CONSTANTS.OPERATORS.ROLES.${role}`, { defaultValue: role })}
        </div>
      </div>
    </div>
  );
};

export default React.memo(DepartmentItem);
