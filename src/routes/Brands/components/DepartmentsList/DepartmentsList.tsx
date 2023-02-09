import React, { useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { getCrmBrandStaticFileUrl } from 'config';
import { BrandToAuthorities } from '__generated__/types';
import { withStorage } from 'providers/StorageProvider';
import Copyrights from 'components/Copyrights';
import Preloader from 'components/Preloader';
import { getGreetingMsg } from '../utils';
import DepartmentItem from '../DepartmentItem';
import BrandItem from '../BrandItem';
import { useSelectDepartmentMutation } from './graphql/__generated__/SelectDepartmentMutation';
import './DepartmentsList.scss';

type Props = {
  storage: Storage,
  brand: BrandToAuthorities,
  isSingleBrand: boolean,
  onBackClick: () => void,
};

const DepartmentsList = (props: Props) => {
  const { storage, brand, isSingleBrand, onBackClick } = props;

  const history = useHistory();

  // ===== Requests ===== //
  const [selectDepartmentMutation, { loading }] = useSelectDepartmentMutation();

  // ===== Handlers ===== //
  const handleSelectDepartament = async (department: string, role: string) => {
    try {
      const { data } = await selectDepartmentMutation({
        variables: {
          brand: brand.id,
          department,
          role,
        },
      });

      const { token, uuid } = data?.auth?.chooseDepartment || {};

      storage.set('token', token);
      storage.set('auth', { department, role, uuid });
      storage.set('brand', brand);

      history.push('/dashboard');
    } catch (e) {
      // Do nothing...
    }
  };

  // ===== Effects ===== //
  useEffect(() => {
    if (brand.authorities.length === 1) {
      const { department, role } = brand.authorities[0];

      handleSelectDepartament(department, role);
    }
  }, []);

  if (!brand) {
    return <Redirect to="/sign-in" />;
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

export default compose(
  React.memo,
  withStorage,
)(DepartmentsList);
