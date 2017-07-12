import React, { Component } from 'react';
import classNames from 'classnames';
import SignInBrandItem from './SignInBrandItem';
import PropTypes from '../propTypes';
import Greeting from '../../../components/Greeting';

class SignInBrands extends Component {
  state = {
    step: 0,
  };

  componentWillReceiveProps(nextProps) {
    const { activeBrand } = this.props;

    if (activeBrand !== nextProps.activeBrand) {
      if (nextProps.activeBrand) {
        this.setState({ step: 1 }, () => {
          setTimeout(() => {
            this.setState({ step: 2 }, () => {
              setTimeout(() => {
                this.setState({ step: 3 }, () => {
                  setTimeout(() => {
                    this.setState({ step: 4 });
                  }, 600);
                });
              }, 100);
            });
          }, 500);
        });
      }
    }
  }

  render() {
    const { step } = this.state;
    const {
      activeBrand,
      username,
      brands,
      onSelect,
      className,
    } = this.props;
    const headingClassName = classNames('sign-in__multibrand_heading', { 'fadeOut-text': step > 2 });
    const callToActionClassName = classNames('sign-in__multibrand_call-to-action', { 'fadeOut-text': step > 2 });
    const brandsListClassName = classNames('sign-in__multibrand_choice', {
      chosen: step > 2,
    });

    return (
      <div className={className}>
        {
          username &&
          <div className={headingClassName}>
            <Greeting username={username} />
          </div>
        }
        <div className={callToActionClassName}>
          Please, choose the brand
        </div>
        <div className={brandsListClassName}>
          {brands.map((brand) => {
            const isActive = activeBrand && activeBrand.id === brand.id;
            const itemClassName = classNames('choice-item', {
              'chosen-brand': step > 2 && isActive,
              fadeOut: step > 0 && !isActive,
              'returned-block': step > 1 && !isActive,
              'position-absolute': step > 3 && !isActive,
            });

            return (
              <SignInBrandItem
                className={itemClassName}
                key={brand.id}
                {...brand}
                onClick={() => onSelect(brand)}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

SignInBrands.propTypes = {
  activeBrand: PropTypes.brand,
  className: PropTypes.string,
  username: PropTypes.string,
  brands: PropTypes.arrayOf(PropTypes.brand).isRequired,
  onSelect: PropTypes.func.isRequired,
};
SignInBrands.defaultProps = {
  activeBrand: null,
  className: 'sign-in__multibrand',
  username: null,
};

export default SignInBrands;
