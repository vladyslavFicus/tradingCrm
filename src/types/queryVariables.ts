export interface QueryVariables {
  args: {
    keyword?: string
    page: {
      from: number
      size: number
      sorts?: []
    }
  }
}