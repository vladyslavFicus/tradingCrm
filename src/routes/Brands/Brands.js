import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { withStorage } from 'providers/StorageProvider';
import ChooseBrands from './components/ChooseBrands';
import ChooseDepartments from './components/ChooseAuthority';

class Brands extends PureComponent {
  static propTypes = {
    token: PropTypes.string,
  };

  static defaultProps = {
    token: null,
  };

  state = {
    step: 0,
    brand: null,
    brands: [],
  };

  onBrandChosen = (brand, brands) => {
    this.setState({ brand, brands, step: 1 });
  };

  onDepartmentBackClick = () => {
    this.setState({ step: 0, brand: null });
  };

  render() {
    const { token } = this.props;
    const { step, brands, brand } = this.state;

    if (!token) {
      return <Redirect to="/sign-in" />;
    }

    return (
      <Choose>
        <When condition={step === 0}>
          <ChooseBrands
            onChosen={this.onBrandChosen}
          />
        </When>
        <When condition={step === 1}>
          <ChooseDepartments
            brand={brand}
            brands={brands}
            onBackClick={this.onDepartmentBackClick}
          />
        </When>
      </Choose>
    );
  }
}

export default withStorage(['token'])(Brands);
