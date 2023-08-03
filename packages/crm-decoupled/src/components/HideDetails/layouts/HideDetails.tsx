import React from 'react';
import { Collapse } from 'reactstrap';
import I18n from 'i18n-js';
import { Button } from 'components/Buttons';
import useHideDetails from '../hooks/useHideDetails';
import './HideDetails.scss';

type Props = {
  children: React.ReactNode,
}

const HideDetails = (props: Props) => {
  const { children } = props;

  const { collapsed, handleCollapseBlock } = useHideDetails();

  return (
    <>
      <div className="HideDetails">
        <div className="HideDetails__divider" />

        <Button
          className="HideDetails__trigger"
          onClick={handleCollapseBlock}
        >
          <Choose>
            <When condition={collapsed}>
              {I18n.t('COMMON.DETAILS_COLLAPSE.SHOW')}
            </When>

            <Otherwise>
              {I18n.t('COMMON.DETAILS_COLLAPSE.HIDE')}
            </Otherwise>
          </Choose>
        </Button>

        <div className="HideDetails__divider" />
      </div>

      <Collapse isOpen={!collapsed}>
        {children}
      </Collapse>
    </>
  );
};


export default React.memo(HideDetails);
