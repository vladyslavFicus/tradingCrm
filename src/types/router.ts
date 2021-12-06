export interface Router {
  search: string,
  pathname: string,
  query: Object,
  state: Object,
  push: (values: string) => void,
  replace: (values: string) => void,
}
