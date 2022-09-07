import React, { useState } from 'react';
import I18n from 'i18n-js';
import { FormikProps } from 'formik';
import ReactPlaceholder from 'react-placeholder';
import { TextRow } from 'react-placeholder/lib/placeholders';
import { omit } from 'lodash';
import Select from 'components/Select';
import { Button } from 'components/UI';
import { FormValues } from '../../types';
import { useNewGroupTemplatesQuery, NewGroupTemplatesQuery } from './graphql/__generated__/NewGroupTemplatesQuery';
import './GroupProfileHeader.scss';

interface Props {
  formik: FormikProps<FormValues>,
}

type Group = ExtractApolloTypeFromPageable<NewGroupTemplatesQuery['tradingEngine']['groups']>;

const GroupProfileHeader = ({ formik }: Props) => {
  const { dirty, isSubmitting, isValid, setValues, values } = formik;
  const [templateNameGroup, setTemplateName] = useState<String | null>(null);
  const groupTemplates = useNewGroupTemplatesQuery({
    variables: {
      args: {
        page: {
          from: 0,
          size: 10000,
        },
      },
    },
  });
  const content = groupTemplates.data?.tradingEngine.groups.content || [];
  const { groupName, description, enable } = values;

  const onChangeHandler = (templateName: String) => {
    const group = content.find(item => item.groupName === templateName);
    const template = omit(group, ['groupName']);
    setTemplateName(templateName);
    setValues({ groupName, description, enable, ...template });
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
          <If condition={!groupName}>
            <span className="GroupProfileHeader__select-label">
              {I18n.t('TRADING_ENGINE.GROUP.TEMPLATES')}
            </span>
            <Select
              // Required because the Select component is not the TS component and doesn't support typing
              // @ts-ignore
              onChange={onChangeHandler}
              value={templateNameGroup}
              placeholder={I18n.t('TRADING_ENGINE.GROUP.COMMON_GROUP_FORM.GROUP_TEMPLATE')}
            >
              {content.map((group: Group) => (
                <option key={group.groupName} value={group.groupName}>
                  {group.groupName}
                </option>
              ))}
            </Select>
          </If>
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
