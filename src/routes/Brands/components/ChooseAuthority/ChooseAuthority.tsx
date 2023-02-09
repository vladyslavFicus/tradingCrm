import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { getCrmBrandStaticFileUrl } from 'config';
import BrandItem from 'components/BrandItem';
import Copyrights from 'components/Copyrights';
import { Authority, BrandToAuthorities } from '__generated__/types';
import { withStorage } from 'providers/StorageProvider';
import Greeting from 'components/Greeting';
import Preloader from 'components/Preloader';
import AuthorityItem from './components/AuthorityItem';
import './ChooseAuthority.scss';
import { useChooseAuthorityMutation } from './graphql/__generated__/ChooseAuthorityMutation';

type Props = {
  storage: Storage,
  brand: BrandToAuthorities,
  showGreeting: boolean,
  showBackButton: boolean,
  onBackClick: () => void,
}

const ChooseAuthority = (props: Props) => {
  const [isLoading, setLoading] = useState<boolean>(true);

  const [chooseAuthority] = useChooseAuthorityMutation();

  const { storage, brand, brand: { authorities, id }, onBackClick, showGreeting, showBackButton } = props;

  const history = useHistory();

  const handleSelectAuthority = async ({ department, role }: Authority) => {
    try {
      const { data } = await chooseAuthority({
        variables: {
          brand: id,
          department,
          role,
        },
      });

      const { token, uuid } = data?.auth?.chooseDepartment || {};

      storage.set('token', token);
      storage.set('auth', { department, role, uuid });

      history.push('/dashboard');
    } catch (e) {
      // Do nothing...
    }
  };

  // if only one authority is present - choose it automatically
  useEffect(() => {
    if (authorities.length === 1) {
      handleSelectAuthority(authorities[0]);
    } else {
      setLoading(false);
    }
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div className="ChooseAuthority">
      <div className="ChooseAuthority__logo">
        <img
          alt="logo"
          src={getCrmBrandStaticFileUrl('assets/logo.svg')}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      <div>
        <If condition={showGreeting}>
          <div className="ChooseAuthority__greeting">
            <Greeting />
          </div>
        </If>

        <div className="ChooseAuthority__brand">
          <BrandItem brand={brand} isActive />
        </div>

        <If condition={showBackButton}>
          <div className="ChooseAuthority__back" onClick={onBackClick}>
            <span>{I18n.t('DEPARTMENTS.ALL_BRANDS')}</span>
          </div>
        </If>

        <div className="ChooseAuthority__list">
          {authorities.map(authority => (
            <AuthorityItem
              key={authority.department}
              authority={authority}
              onClick={() => handleSelectAuthority(authority)}
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
)(ChooseAuthority);
