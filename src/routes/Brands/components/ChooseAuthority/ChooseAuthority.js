import React, { PureComponent } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';
import { getCrmBrandStaticFileUrl } from 'config';
import Greeting from 'components/Greeting';
import BrandItem from 'components/BrandItem';
import Copyrights from 'components/Copyrights';
import Preloader from 'components/Preloader';
import AuthorityItem from './components/AuthorityItem';
import ChooseAuthorityMutation from './graphql/ChooseAuthorityMutation';
import './ChooseAuthority.scss';

class ChooseAuthority extends PureComponent {
  static propTypes = {
    chooseAuthority: PropTypes.func.isRequired,
    brand: PropTypes.brand.isRequired,
    brands: PropTypes.array.isRequired,
    onBackClick: PropTypes.func.isRequired,
    ...PropTypes.router,
    ...withStorage.propTypes,
  }

  state = {
    loading: true,
  };

  componentDidMount() {
    const { authorities } = this.props.brand;

    if (authorities.length === 1) {
      return this.handleSelectAuthority(authorities[0]);
    }

    this.setState({ loading: false });

    return null;
  }

  handleSelectAuthority = async ({ department, role }) => {
    const { brand, chooseAuthority, storage, history } = this.props;

    try {
      const { data: { auth: { chooseDepartment: { token, uuid } } } } = await chooseAuthority({
        variables: {
          brand: brand.id,
          department,
          role,
        },
      });

      storage.set('token', token);
      storage.set('auth', { department, role, uuid });

      history.push('/dashboard');
    } catch (e) {
      // Do nothing...
    }
  }

  render() {
    const { brand, brands, onBackClick } = this.props;
    const { loading } = this.state;

    if (!brand) {
      return <Redirect to="/sign-in" />;
    }

    if (loading) {
      return <Preloader />;
    }

    return (
      <div className="ChooseAuthority">
        <div className="ChooseAuthority__logo">
          <img
            alt="logo"
            src={getCrmBrandStaticFileUrl('assets/logo.svg')}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>

        <div>
          <If condition={brands.length <= 1}>
            <div className="ChooseAuthority__greeting">
              <Greeting />
            </div>
          </If>

          <div className="ChooseAuthority__brand">
            <BrandItem brand={brand} isActive />
          </div>

          <If condition={brands.length > 1}>
            <div className="ChooseAuthority__back" onClick={onBackClick}>
              <span>{I18n.t('DEPARTMENTS.ALL_BRANDS')}</span>
            </div>
          </If>

          <div className="ChooseAuthority__list">
            {brand.authorities.map(authority => (
              <AuthorityItem
                key={authority.department}
                authority={authority}
                onClick={() => this.handleSelectAuthority(authority)}
              />
            ))}
          </div>
        </div>

        <Copyrights />
      </div>
    );
  }
}

export default compose(
  withRouter,
  withStorage,
  withRequests({
    chooseAuthority: ChooseAuthorityMutation,
  }),
)(ChooseAuthority);
