import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';
import PropTypes from '../../constants/propTypes';
import Greeting from '../Greeting';
import DepartmentItem from './DepartmentItem';
import { BrandItem } from '../Brands';

class Departments extends Component {
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
      <CSSTransition classNames="departments" in={startAnimation} timeout={0}>
        <div className="departments">
          <Choose>
            <When condition={brands.length <= 1}>
              <div className="departments__title">
                <Greeting />
              </div>
            </When>
          </Choose>

          <If condition={brand}>
            <div className="departments__brand">
              <BrandItem isActive {...brand} />
            </div>
          </If>

          <Choose>
            <When condition={brands.length > 1}>
              <div className="departments__back">
                <span onClick={handleOnBackClick}>All brands</span>
              </div>
            </When>
          </Choose>

          <div className="departments__list">
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
