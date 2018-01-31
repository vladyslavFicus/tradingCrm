import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from '../../constants/propTypes';
import BrandItem from './BrandItem';
import Greeting from '../Greeting';

class Brands extends Component {
  static propTypes = {
    activeBrand: PropTypes.brand,
    logged: PropTypes.bool.isRequired,
    username: PropTypes.string,
    brands: PropTypes.arrayOf(PropTypes.brand).isRequired,
    onSelect: PropTypes.func.isRequired,
  };
  static defaultProps = {
    activeBrand: null,
    username: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      step: +props.logged,
      activeBrand: null,
      reverseStep: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { activeBrand, logged } = this.props;

    if (nextProps.brands.length > 1) {
      if (logged !== nextProps.logged) {
        if (nextProps.logged && !nextProps.activeBrand) {
          this.activeTimeout = setTimeout(() => {
            this.setState({ step: 1 });
          }, 351);
        }
      }

      if (activeBrand !== nextProps.activeBrand) {
        if (nextProps.activeBrand) {
          this.setState({ step: 2, activeBrand: nextProps.activeBrand, reverseStep: false }, () => {
            this.activeTimeout = setTimeout(() => {
              this.setState({ step: 3, reverseStep: false }, () => {
                this.activeTimeout = setTimeout(() => {
                  this.setState({ step: 4, reverseStep: false }, () => {
                    this.activeTimeout = setTimeout(() => {
                      this.setState({ step: 5, reverseStep: false });
                    }, 600);
                  });
                }, 200);
              });
            }, 100);
          });
        } else {
          this.setState({ step: 4, reverseStep: true }, () => {
            this.activeTimeout = setTimeout(() => {
              this.setState({ step: 3, reverseStep: true }, () => {
                this.activeTimeout = setTimeout(() => {
                  this.setState({ step: 2, reverseStep: true }, () => {
                    this.activeTimeout = setTimeout(() => {
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

  componentWillUnmount() {
    if (this.activeTimeout !== null) {
      clearTimeout(this.activeTimeout);
      this.activeTimeout = null;
    }
  }

  activeTimeout = null;

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
              <BrandItem
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

export default Brands;
