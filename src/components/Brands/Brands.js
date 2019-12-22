import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';
import PropTypes from '../../constants/propTypes';
import BrandItem from './BrandItem';
import Greeting from '../Greeting';

class Brands extends Component {
  static propTypes = {
    brands: PropTypes.arrayOf(PropTypes.brand).isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  state = {
    startAnimation: false,
  }

  componentDidMount() {
    this.setState({ startAnimation: true });
  }

  render() {
    const {
      onSelect,
      brands,
    } = this.props;

    const { startAnimation } = this.state;

    return (
      <CSSTransition classNames="brands" in={startAnimation} timeout={0}>
        <div className="brands form-page__multibrand">
          <div className="brands__title form-page__multibrand_heading">
            <Greeting />
          </div>
          <div className="brands__subtitle">
            Please, choose the brand
          </div>
          <div className="brands__list">
            {brands.map(brand => (
              <BrandItem
                key={brand.id}
                {...brand}
                onClick={() => onSelect(brand)}
              />
            ))}
          </div>
        </div>
      </CSSTransition>
    );
  }
}

export default Brands;
