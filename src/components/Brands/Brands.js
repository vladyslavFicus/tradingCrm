import React, { PureComponent } from 'react';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'constants/propTypes';
import Greeting from 'components/Greeting';
import BrandItem from './components/BrandItem';
import './Brands.scss';

class Brands extends PureComponent {
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
      <CSSTransition classNames="Brands" in={startAnimation} timeout={0}>
        <div className="Brands">
          <div className="Brands__title">
            <Greeting />
          </div>
          <div className="Brands__subtitle">
            Please, choose the brand
          </div>
          <div className="Brands__list">
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
