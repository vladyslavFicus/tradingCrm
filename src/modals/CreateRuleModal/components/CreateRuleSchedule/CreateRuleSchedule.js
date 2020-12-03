import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { ReactComponent as WarnIcon } from './warn-icon.svg';
import { ReactComponent as TableIcon } from './table-icon.svg';
import { ReactComponent as SheetIcon } from './sheet-icon.svg';
import './CreateRuleSchedule.scss';

class CreateRuleSchedule extends PureComponent {
  render() {
    return (
      <div className="CreateRuleSchedule">
        <div className="CreateRuleSchedule__title">
          <WarnIcon className="CreateRuleSchedule__warn-icon" />
          <span>{I18n.t('RULE_MODAL.SCHEDULE.ATTENTION.TITLE')}</span>
        </div>
        <div className="CreateRuleSchedule__phases">
          <div className="CreateRuleSchedule__phases-item">
            <TableIcon className="CreateRuleSchedule__phases-icon" />
            <span className="CreateRuleSchedule__phases-text">
              {I18n.t('RULE_MODAL.SCHEDULE.ATTENTION.PHASE_FINISH')}
            </span>
          </div>
          <div className="CreateRuleSchedule__phases-item">
            <SheetIcon className="CreateRuleSchedule__phases-icon" />
            <span className="CreateRuleSchedule__phases-text">
              {I18n.t('RULE_MODAL.SCHEDULE.ATTENTION.PHASE_EDIT')}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateRuleSchedule;
