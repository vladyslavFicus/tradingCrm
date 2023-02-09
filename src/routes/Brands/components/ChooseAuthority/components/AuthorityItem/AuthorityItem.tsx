import React from 'react';
import I18n from 'i18n-js';
import './AuthorityItem.scss';
import { Authority } from '__generated__/types';

type Props = {
  authority: Authority,
  onClick: () => void,
}

const AuthorityItem = (props: Props) => {
  const { onClick } = props;
  const { department, role } = props.authority || {};

  return (
    <div className="AuthorityItem" onClick={onClick}>
      <img
        src={`/img/departments/${department}.svg`}
        onError={(e) => {
          e.currentTarget.src = '/img/image-placeholder.svg';
        }}
        className="AuthorityItem__image"
        alt={`${department} / ${role}`}
      />

      <div className="AuthorityItem__head">
        <div className="AuthorityItem__title">
          {I18n.t(`CONSTANTS.OPERATORS.DEPARTMENTS.${department}`, { defaultValue: department })}
        </div>

        <div className="AuthorityItem__role">
          {I18n.t(`CONSTANTS.OPERATORS.ROLES.${role}`, { defaultValue: role })}
        </div>
      </div>
    </div>
  );
};

export default React.memo(AuthorityItem);
