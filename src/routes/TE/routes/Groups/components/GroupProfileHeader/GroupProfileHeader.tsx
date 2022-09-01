import React from 'react';
import I18n from 'i18n-js';
import { FormikProps } from 'formik';
import ReactPlaceholder from 'react-placeholder';
import { TextRow } from 'react-placeholder/lib/placeholders';
import { omit } from 'lodash';
import Select from 'components/Select';
import { Button } from 'components/UI';
import { FormValues } from '../../types';
import './GroupProfileHeader.scss';
import { useNewGroupTemplatesQuery, NewGroupTemplatesQuery } from './graphql/__generated__/NewGroupTemplatesQuery';

interface Props {
  formik: FormikProps<FormValues>,
}

type Group = ExtractApolloTypeFromPageable<NewGroupTemplatesQuery['tradingEngine']['groups']>;

const GroupProfileHeader = ({ formik }: Props) => {
  const { dirty, isSubmitting, isValid, setValues, values } = formik;
  const groupTemplates = useNewGroupTemplatesQuery({
    variables: {
      args: {
        page: {
          from: 0,
          size: 1000,
        },
      },
    },
  });
  const content = groupTemplates.data?.tradingEngine.groups.content || [];
  const { groupName, description } = values;

  const onChangeHandler = (group: Group) => {
    const template = omit(group, ['groupName']);
    setValues({ groupName, description, ...template });
  };

  return (
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
      <If condition={!groupTemplates.loading}>
        <div
          className="GroupProfileHeader__select"
        >
          <span className="GroupProfileHeader__select-label">
            {I18n.t('TRADING_ENGINE.GROUP.TEMPLATES')}
          </span>
          <Select
            // @ts-ignore
            onChange={onChangeHandler}
            placeholder={I18n.t('TRADING_ENGINE.GROUP.COMMON_GROUP_FORM.GROUP_TEMPLATE')}
          >
            {content.map((group: any) => (
              <option key={group.groupName} value={group}>
                {group.groupName}
              </option>
            ))}
          </Select>
        </div>
      </If>
      <Button
        small
        primary
        disabled={!dirty || isSubmitting || !isValid}
        type="submit"
        className="GroupProfileHeader__button"
      >
        {I18n.t('COMMON.SAVE')}
      </Button>
    </div>
  );
};

export default React.memo(GroupProfileHeader);
