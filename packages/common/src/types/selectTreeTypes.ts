export type Node = {
  value: string,
  label: string,
  children?: Node[],
  showCheckbox?: boolean,
};

export type Props = {
  label?: string,
  value?: string,
  disabled?: boolean,
  className?: string,
  onChange?: (value: string | string[]) => void,
  nodes: Node[],
  favorites?: string[],
};
