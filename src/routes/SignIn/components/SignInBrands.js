import React from 'react';
import PropTypes from 'prop-types';
import SignInBrandItem from './SignInBrandItem';
import { brandsConfig } from '../constants';

const SignInBrands = (props) => {
  const { username, brands, onSelect } = props;

  return (
    <div className="sign-in__multibrand">
      <div className="sign-in__multibrand_heading">
        Good morning, <span className="heading-name">{username}</span>!
      </div>
      <div className="sign-in__multibrand_call-to-action">
        Please, choose the brand
      </div>
      <div className="sign-in__multibrand_choice">
        {brands.map((brand) => {
          const brandConfig = brandsConfig[brand];

          return brandConfig ? (
            <SignInBrandItem
              image={brandConfig.image}
              name={brandConfig.name}
              onClick={() => onSelect(brand)}
            />
          ) : null;
        })}
      </div>
    </div>
  );
};
SignInBrands.propTypes = {
  username: PropTypes.string.isRequired,
  brands: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default SignInBrands;
