import React, { SVGProps } from 'react';
import { ClickToCall__CallSystem__Enum as CallSystem } from '__generated__/types';
import { ReactComponent as DidlogicIcon } from '../icons/didlogic.svg';
import { ReactComponent as NewtelIcon } from '../icons/newtel.svg';
import { ReactComponent as CommpeakIcon } from '../icons/commpeak.svg';
import { ReactComponent as CoperatoIcon } from '../icons/coperato.svg';
import { ReactComponent as ClearvoiceIcon } from '../icons/clearvoice.svg';
import { ReactComponent as SquaretalkIcon } from '../icons/squaretalk.svg';
import { ReactComponent as GlobalcallIcon } from '../icons/globalcall.svg';

export const ICONS: Record<CallSystem, React.ElementType<SVGProps<SVGSVGElement>>> = {
  [CallSystem.DIDLOGIC]: DidlogicIcon,
  [CallSystem.NEWTEL]: NewtelIcon,
  [CallSystem.COMMPEAK]: CommpeakIcon,
  [CallSystem.COPERATO]: CoperatoIcon,
  [CallSystem.CLEAR_VOICE]: ClearvoiceIcon,
  [CallSystem.SQUARETALK]: SquaretalkIcon,
  [CallSystem.GLOBAL_CALL]: GlobalcallIcon,
};

export const TOOLTIP_STYLE = {
  style: {
    background: 'var(--dropdown-surface-background)',
    borderRadius: '5px',
    'z-index': 'var(--z-index-popover)',
  },
  arrowStyle: {
    color: 'var(--dropdown-surface-background)',
    borderColor: 'none',
    marginTop: '-12px',
    left: '-12px',
  },
};
