import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from '../../constants/propTypes';
import Greeting from '../Greeting';
import DepartmentItem from './DepartmentItem';

class Departments extends Component {
  static propTypes = {
    logged: PropTypes.bool.isRequired,
    departments: PropTypes.arrayOf(PropTypes.department).isRequired,
    onSelect: PropTypes.func.isRequired,
    onBackClick: PropTypes.func.isRequired,
    canGoBack: PropTypes.bool,
    brand: PropTypes.brand,
  };
  static defaultProps = {
    canGoBack: false,
    brand: null,
  };

  state = { step: 0, departments: [] };

  componentWillReceiveProps(nextProps) {
    const { logged } = this.props;

    if (logged !== nextProps.logged) {
      if (nextProps.logged) {
        this.activeTimeout = setTimeout(() => {
          this.setState({ step: 1, departments: nextProps.departments });
        }, 250);
      } else {
        this.activeTimeout = setTimeout(() => {
          this.setState({ step: 0 }, () => {
            this.activeTimeout = setTimeout(() => {
              this.setState({ departments: nextProps.departments });
            }, 200);
          });
        }, 370);
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
    const { step, departments } = this.state;
    const { onSelect, onBackClick, canGoBack, brand } = this.props;

    if (!step) {
      return null;
    }

    const className = classNames('form-page__department', {
      fadeOutDown: step === 0,
      fadeInUp: step > 0,
      'form-page__single-brand': !canGoBack,
    });

    return (
      <div className={className}>
        {
          !canGoBack
            ? <div className="form-page__multibrand_heading"><Greeting /></div>
            : (
              <div className="form-page__department_return" onClick={onBackClick}>
                All <span className="return-label">brands</span>
              </div>
            )
        }
        {
          !canGoBack && brand &&
          <div className="form-page__single-brand_brand">
            <div>
              <img alt={brand.name} id={brand.id} {...brand.image} />
            </div>
            <div className="form-page__single-brand_label">
              {brand.name}
            </div>
          </div>
        }
        <div className="form-page__multibrand_call-to-action">
          {canGoBack ? 'And now, choose the department' : 'Please, choose  the department'}
        </div>
        <div className="form-page__department_block">
          {departments.map(department => (
            <DepartmentItem key={department.name} {...department} onClick={() => onSelect(department)} />
          ))}
        </div>
      </div>
    );
  }
}

export default Departments;
