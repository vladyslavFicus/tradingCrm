import React, { PureComponent } from 'react';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'constants/propTypes';
import Greeting from 'components/Greeting';
import BrandItem from 'components/Brands/components/BrandItem';
import DepartmentItem from './components/DepartmentItem';
import './Departments.scss';

class Departments extends PureComponent {
  static propTypes = {
    departments: PropTypes.arrayOf(PropTypes.department).isRequired,
    brands: PropTypes.arrayOf(PropTypes.brand),
    onSelect: PropTypes.func.isRequired,
    brand: PropTypes.brand,
  };

  static defaultProps = {
    brand: null,
    brands: [],
  };

  state = {
    startAnimation: false,
  };

  componentDidMount() {
    this.setState({ startAnimation: true });
  }

  render() {
    const {
      brand,
      brands,
      onSelect,
      departments,
      handleOnBackClick,
    } = this.props;

    const { startAnimation } = this.state;

    return (
      <CSSTransition classNames="Departments" in={startAnimation} timeout={0}>
        <div className="Departments">
          <Choose>
            <When condition={brands.length <= 1}>
              <div className="Departments__title">
                <Greeting />
              </div>
            </When>
          </Choose>

          <If condition={brand}>
            <div className="Departments__brand">
              <BrandItem isActive {...brand} />
            </div>
          </If>

          <Choose>
            <When condition={brands.length > 1}>
              <div className="Departments__back">
                <span onClick={handleOnBackClick}>All brands</span>
              </div>
            </When>
          </Choose>

          <div className="Departments__list">
            {departments.map(department => (
              <DepartmentItem
                key={department.name}
                {...department}
                onClick={() => onSelect(department)}
              />
            ))}
          </div>
        </div>
      </CSSTransition>
    );
  }
}

export default Departments;
