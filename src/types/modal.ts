export interface Modal<TProps = {}> {
  show: (props?: TProps) => void;
  hide: () => void;
}
