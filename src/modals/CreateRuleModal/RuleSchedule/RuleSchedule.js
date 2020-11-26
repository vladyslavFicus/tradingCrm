import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { ReactComponent as WarnIcon } from './warn-icon.svg';
import { ReactComponent as TableIcon } from './table-icon.svg';
import { ReactComponent as SheetIcon } from './sheet-icon.svg';
import './RuleSchedule.scss';

class RuleSchedule extends PureComponent {
  render() {
    return (
      <div className="RuleSchedule">
        <div className="RuleSchedule__title">
          <WarnIcon className="RuleSchedule__warn-icon" />
          <span>{I18n.t('RULE_MODAL.SCHEDULE.ATTENTION.TITLE')}</span>
        </div>
        <div className="RuleSchedule__phases">
          <div className="RuleSchedule__phases-item">
            <TableIcon className="RuleSchedule__phases-icon" />
            <span className="RuleSchedule__phases-text">
              {I18n.t('RULE_MODAL.SCHEDULE.ATTENTION.PHASE_FINISH')}
            </span>
          </div>
          <div className="RuleSchedule__phases-item">
            <SheetIcon className="RuleSchedule__phases-icon" />
            <span className="RuleSchedule__phases-text">
              {I18n.t('RULE_MODAL.SCHEDULE.ATTENTION.PHASE_EDIT')}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default RuleSchedule;
