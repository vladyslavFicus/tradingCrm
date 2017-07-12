import React from 'react';
import classNames from 'classnames';
import SignInBrandItem from './SignInBrandItem';
import PropTypes from '../propTypes';
import Greeting from '../../../components/Greeting';

const SignInBrands = (props) => {
  const {
    activeBrand,
    username,
    brands,
    onSelect,
    className,
  } = props;

  return (
    <div className={className}>
      <div className={classNames('sign-in__multibrand_heading', { 'fadeOut-text': !!activeBrand })}>
        {username && <Greeting username={username} />}
      </div>
      <div className={classNames('sign-in__multibrand_call-to-action', { 'fadeOut-text': !!activeBrand })}>
        Please, choose the brand
      </div>
      <div
        className={classNames('sign-in__multibrand_choice', {
          chosen: !!activeBrand,
        })}
      >
        {brands.map((brand) => {
          const isActive = activeBrand && activeBrand.id === brand.id;

          return (
            <SignInBrandItem
              className={classNames('choice-item', {
                'chosen-brand': isActive,
                fadeOut: !!activeBrand && !isActive,
                'remove-block': !!activeBrand && !isActive,
              })}
              key={brand.id}
              {...brand}
              onClick={() => onSelect(brand)}
            />
          );
        })}
      </div>
    </div>
  );
};
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
