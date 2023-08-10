import React from 'react';
import { Navigate } from 'react-router-dom';
import I18n from 'i18n-js';
import { BrandToAuthorities } from '__generated__/types';
import { Preloader } from 'components';
import Copyrights from 'components/Copyrights';
import { getGreetingMsg } from 'routes/Brands/utils';
import useDepartmentsList from 'routes/Brands/hooks/useDepartmentsList';
import DepartmentItem from '../DepartmentItem';
import BrandItem from '../BrandItem';
import './DepartmentsList.scss';

type Props = {
  brand: BrandToAuthorities,
  isSingleBrand: boolean,
  onBackClick: () => void,
};

const DepartmentsList = (props: Props) => {
  const { brand, isSingleBrand, onBackClick } = props;

  const {
    loading,
    handleSelectDepartament,
    getCrmBrandStaticFileUrl,
  } = useDepartmentsList({ brand });

  if (!brand) {
    return <Navigate replace to="/sign-in" />;
  }

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="DepartmentsList">
      <div className="DepartmentsList__logo">
        <img
          alt="logo"
          src={getCrmBrandStaticFileUrl('assets/logo.svg')}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>

      <div>
        <If condition={isSingleBrand}>
          <div className="DepartmentsList__greeting">
            {getGreetingMsg()}
          </div>
        </If>

        <div className="DepartmentsList__brand">
          <BrandItem brand={brand} isActive />
        </div>

        <If condition={!isSingleBrand}>
          <div className="DepartmentsList__back" onClick={onBackClick}>
            <span>{I18n.t('DEPARTMENTS.ALL_BRANDS')}</span>
          </div>
        </If>

        <div className="DepartmentsList__list">
          {brand.authorities.map(({ department, role }) => (
            <DepartmentItem
              key={department}
              department={department}
              role={role}
              onClick={() => handleSelectDepartament(department, role)}
            />
          ))}
        </div>
      </div>

      <Copyrights />
    </div>
  );
};

export default React.memo(DepartmentsList);
