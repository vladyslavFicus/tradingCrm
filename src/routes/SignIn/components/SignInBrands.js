import React from 'react';
import SignInBrandItem from './SignInBrandItem';
import PropTypes from '../propTypes';

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
      <div className="sign-in__multibrand_heading">
        Good morning, <span className="heading-name">{username}</span>!
      </div>
      <div className="sign-in__multibrand_call-to-action">
        Please, choose the brand
      </div>
      <div className="sign-in__multibrand_choice">
        {brands.map(brand => {
          const isActive = activeBrand && activeBrand.id === brand.id;

          return (
            <SignInBrandItem
              className={}
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
  className: PropTypes.string,
  username: PropTypes.string.isRequired,
  brands: PropTypes.arrayOf(PropTypes.brand).isRequired,
  onSelect: PropTypes.func.isRequired,
};
SignInBrands.defaultProps = {
  className: 'sign-in__multibrand',
};

export default SignInBrands;
