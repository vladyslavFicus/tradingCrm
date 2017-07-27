import React, { Component } from 'react';
import classNames from 'classnames';
import SignInBrandItem from './SignInBrandItem';
import PropTypes from '../propTypes';
import Greeting from '../../../components/Greeting';

class SignInBrands extends Component {
  state = {
    step: 0,
    activeBrand: null,
    reverseStep: false,
  };

  componentWillReceiveProps(nextProps) {
    const { activeBrand, logged, brands } = this.props;

    if (brands.length > 1) {
      if (logged !== nextProps.logged) {
        if (nextProps.logged && !nextProps.activeBrand) {
          setTimeout(() => {
            this.setState({ step: 1 });
          }, 351);
        }
      }

      if (activeBrand !== nextProps.activeBrand) {
        if (nextProps.activeBrand) {
          this.setState({ step: 2, activeBrand: nextProps.activeBrand, reverseStep: false }, () => {
            setTimeout(() => {
              this.setState({ step: 3, reverseStep: false }, () => {
                setTimeout(() => {
                  this.setState({ step: 4, reverseStep: false }, () => {
                    setTimeout(() => {
                      this.setState({ step: 5, reverseStep: false });
                    }, 600);
                  });
                }, 200);
              });
            }, 100);
          });
        } else {
          this.setState({ step: 4, reverseStep: true }, () => {
            setTimeout(() => {
              this.setState({ step: 3, reverseStep: true }, () => {
                setTimeout(() => {
                  this.setState({ step: 2, reverseStep: true }, () => {
                    setTimeout(() => {
                      this.setState({ step: 1, reverseStep: true, activeBrand: null });
                    }, 200);
                  });
                }, 200);
              });
            }, 200);
          });
        }
      }
    }
  }

  render() {
    const { step, reverseStep, activeBrand } = this.state;
    const {
      username,
      brands,
      onSelect,
    } = this.props;

    const className = classNames('form-page__multibrand', {
      fadeInUp: step > 0,
    });
    const headingClassName = classNames('form-page__multibrand_heading', {
      'fadeOut-text': (!reverseStep && step > 3) || (reverseStep && step > 1) || brands.length === 1,
      fadeIn: step < 2 && reverseStep,
    });
    const callToActionClassName = classNames('form-page__multibrand_call-to-action', {
      'fadeOut-text': (!reverseStep && step > 3) || (reverseStep && step > 1) || brands.length === 1,
      fadeIn: step < 2 && reverseStep,
    });
    const brandsListClassName = classNames('form-page__multibrand_choice', {
      chosen: (!reverseStep && step > 3) || (reverseStep && step > 2) || brands.length === 1,
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
              fadeIn: (!reverseStep && step === 1 && !isActive),
              fadeOut: (!reverseStep && step > 1 && !isActive) || (reverseStep && step > 1 && !isActive),
              'returned-block': (reverseStep && step < 3 && isActive),
              'remove-block': (!reverseStep && step > 3 && !isActive) || (reverseStep && step > 3 && !isActive),
              'chosen-brand': (!reverseStep && step > 3 && isActive) || (reverseStep && step > 2 && isActive),
              'position-absolute': (!reverseStep && step > 4 && !isActive) || (reverseStep && step > 4 && !isActive),
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
  logged: PropTypes.bool.isRequired,
  username: PropTypes.string,
  brands: PropTypes.arrayOf(PropTypes.brand).isRequired,
  onSelect: PropTypes.func.isRequired,
};
SignInBrands.defaultProps = {
  activeBrand: null,
  username: null,
};

export default SignInBrands;
