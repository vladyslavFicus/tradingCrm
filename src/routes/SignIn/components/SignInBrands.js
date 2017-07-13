import React, { Component } from 'react';
import classNames from 'classnames';
import SignInBrandItem from './SignInBrandItem';
import PropTypes from '../propTypes';
import Greeting from '../../../components/Greeting';

class SignInBrands extends Component {
  state = {
    activeBrand: null,
    step: 0,
    reverseStep: false,
  };

  componentWillReceiveProps(nextProps) {
    const { activeBrand } = this.props;

    if (activeBrand !== nextProps.activeBrand) {
      if (nextProps.activeBrand) {
        this.setState({ step: 1, activeBrand: nextProps.activeBrand }, () => {
          setTimeout(() => {
            this.setState({ step: 2 }, () => {
              setTimeout(() => {
                this.setState({ step: 3 }, () => {
                  setTimeout(() => {
                    this.setState({ step: 4, reverseStep: true });
                  }, 600);
                });
              }, 100);
            });
          }, 100);
        });
      } else {
        this.setState({ step: 3 }, () => {
          setTimeout(() => {
            this.setState({ step: 2 }, () => {
              setTimeout(() => {
                this.setState({ step: 1 }, () => {
                  setTimeout(() => {
                    this.setState({ step: 0, activeBrand: null, reverseStep: false });
                  }, 300);
                });
              }, 200);
            });
          }, 100);
        });
      }
    }
  }

  render() {
    const { step, reverseStep, activeBrand } = this.state;
    const {
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
              'returned-block': step === 0 && !isActive,
              fadeOut: step > 0 && !isActive,
              'remove-block': (!reverseStep && step > 1 && !isActive) || (step > 2 && reverseStep && !isActive),
              'position-absolute': !reverseStep && step > 3 && !isActive && reverseStep,
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
