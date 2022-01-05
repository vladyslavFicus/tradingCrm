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
  isEditGroupPage?: boolean,
}

const GroupProfileHeader = ({ isEditGroupPage, formik }: Props) => {
  const { dirty, isSubmitting, isValid, values } = formik;
  const groupName = values?.groupName || '';

  return (
    <div className="GroupProfileHeader">
      <Choose>
        <When condition={isEditGroupPage}>
          <ReactPlaceholder
            ready={Boolean(groupName)}
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
              {groupName}
            </div>
          </ReactPlaceholder>
        </When>
        <Otherwise>
          <div className="GroupProfileHeader__title">
            {I18n.t('TRADING_ENGINE.GROUP.NEW_GROUP')}
          </div>
        </Otherwise>
      </Choose>
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
};

export default React.memo(GroupProfileHeader);
