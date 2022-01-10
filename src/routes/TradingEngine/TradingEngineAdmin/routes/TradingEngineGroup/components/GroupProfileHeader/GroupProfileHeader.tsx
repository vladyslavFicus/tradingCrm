import React from 'react';
import I18n from 'i18n-js';
import { FormikProps } from 'formik';
import ReactPlaceholder from 'react-placeholder';
import { TextRow } from 'react-placeholder/lib/placeholders';
import { Button } from 'components/UI';
import { Group } from '../../types';
import './GroupProfileHeader.scss';

interface Props {
  formik: FormikProps<Group>,
}

const GroupProfileHeader = ({
  formik: {
    dirty, isSubmitting, isValid,
    initialValues: { groupName },
  },
}: Props) => (
  <div className="GroupProfileHeader">
    <ReactPlaceholder
      ready={groupName !== undefined}
      customPlaceholder={(
        <div>
          <TextRow
            className="animated-background"
            style={{ width: '220px', height: '20px' }}
          />
        </div>
      )}
    >
      <div className="GroupProfileHeader__title">
        {groupName || I18n.t('TRADING_ENGINE.GROUP.NEW_GROUP')}
      </div>
    </ReactPlaceholder>
    <Button
      small
      primary
      disabled={!dirty || isSubmitting || !isValid}
      type="submit"
    >
      {I18n.t('COMMON.SAVE')}
    </Button>
  </div>
);

export default React.memo(GroupProfileHeader);
