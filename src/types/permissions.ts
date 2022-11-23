export interface Permission {
  allows: (action: string) => boolean,
  denies: (action: string) => boolean,
}
