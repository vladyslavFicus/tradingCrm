import React, { Component } from 'react';
import { Popover, PopoverContent } from 'reactstrap';

class NotePopover extends Component {
  render() {
    const { ...rest } = this.props;

    return <Popover placement="bottom" {...rest}>
      <PopoverContent>asdas</PopoverContent>
    </Popover>;
  }
}

export default NotePopover;
