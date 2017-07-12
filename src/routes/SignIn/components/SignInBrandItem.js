import React from 'react';
import PropTypes from 'prop-types';

const SignInBrandItem = ({ className, name, image, onClick }) => (
  <div className={className} onClick={onClick}>
    <div>
      <img src={image} alt={name} />
    </div>
    <div className="choice-item_label">
      {name}
    </div>
  </div>
);
SignInBrandItem.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
SignInBrandItem.defaultProps = {
  className: 'choice-item',
};

export default SignInBrandItem;
