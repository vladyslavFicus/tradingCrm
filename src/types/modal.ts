export interface Modal<TProps = Record<string, any>> {
  show: (props?: TProps) => void;
  hide: () => void;
}
