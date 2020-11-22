import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import RemoveTimeIntervalButton from '../RemoveTimeIntervalButton';
import RuleOperatorSpreads from '../../../../../RuleOperatorSpreads';
import './RuleScheduleTimeInterval.scss';

class RuleScheduleTimeInterval extends PureComponent {
  static propTypes = {
    className: PropTypes.string.isRequired,
    operators: PropTypes.array.isRequired,
    timeInterval: PropTypes.shape({
      operatorSpreads: PropTypes.arrayOf(
        PropTypes.shape({
          parentUser: PropTypes.string,
        }),
      ),
      timeFrom: PropTypes.string,
      timeTo: PropTypes.string,
    }).isRequired,
    namePrefix: PropTypes.string.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    removeTimeInterval: PropTypes.func,
  };

  static defaultProps = {
    removeTimeInterval: null,
  };

  removeOperatorSpread = (index) => {
    const {
      timeInterval: {
        operatorSpreads,
      },
      namePrefix,
      setFieldValue,
    } = this.props;

    const newOperatorSpreads = [...operatorSpreads];
    newOperatorSpreads.splice(index, 1);
    setFieldValue(`${namePrefix}.operatorSpreads`, newOperatorSpreads);
  };

  render() {
    const {
      className,
      operators,
      timeInterval: {
        operatorSpreads,
      },
      namePrefix,
      removeTimeInterval,
    } = this.props;

    return (
      <div className={classNames('RuleScheduleTimeInterval', className)}>
        <RuleOperatorSpreads
          operators={operators}
          operatorSpreads={operatorSpreads}
          removeOperatorSpread={this.removeOperatorSpread}
          namePrefix={`${namePrefix}.operatorSpreads`}
          disabled={false} // TODO
          isValid // TODO
        />
        <RemoveTimeIntervalButton
          className="RuleScheduleTimeInterval__remove-item"
          onClick={removeTimeInterval}
        />
      </div>
    );
  }
}

export default RuleScheduleTimeInterval;
