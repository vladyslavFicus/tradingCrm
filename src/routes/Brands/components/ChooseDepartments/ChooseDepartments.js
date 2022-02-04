import React, { PureComponent } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';
import { getBackofficeBrand } from 'config';
import Greeting from 'components/Greeting';
import BrandItem from 'components/BrandItem';
import DepartmentItem from 'components/DepartmentItem';
import Copyrights from 'components/Copyrights';
import Preloader from 'components/Preloader';
import ChooseDepartmentMutation from './graphql/ChooseDepartmentMutation';
import './ChooseDepartments.scss';

class ChooseDepartments extends PureComponent {
  static propTypes = {
    chooseDepartment: PropTypes.func.isRequired,
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
    const { departments } = this.props.brand;

    if (departments.length === 1) {
      return this.handleSelectDepartment(departments[0]);
    }

    this.setState({ loading: false });

    return null;
  }

  handleSelectDepartment = async ({ department, role }) => {
    const { brand, chooseDepartment, storage, history } = this.props;

    try {
      const { data: { auth: { chooseDepartment: { token, uuid } } } } = await chooseDepartment({
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

    const backofficeLogo = getBackofficeBrand().themeConfig.logo;

    if (!brand) {
      return <Redirect to="/sign-in" />;
    }

    if (loading) {
      return <Preloader />;
    }

    return (
      <div className="ChooseDepartments">
        <div className="ChooseDepartments__logo">
          <If condition={backofficeLogo}>
            <img src={backofficeLogo} alt="logo" />
          </If>
        </div>

        <div>
          <If condition={brands.length <= 1}>
            <div className="ChooseDepartments__greeting">
              <Greeting />
            </div>
          </If>

          <div className="ChooseDepartments__brand">
            <BrandItem brand={brand} isActive />
          </div>

          <If condition={brands.length > 1}>
            <div className="ChooseDepartments__back" onClick={onBackClick}>
              <span>{I18n.t('DEPARTMENTS.ALL_BRANDS')}</span>
            </div>
          </If>

          <div className="ChooseDepartments__list">
            {brand.departments.map(department => (
              <DepartmentItem
                key={department.department}
                department={department}
                onClick={() => this.handleSelectDepartment(department)}
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
    chooseDepartment: ChooseDepartmentMutation,
  }),
)(ChooseDepartments);
