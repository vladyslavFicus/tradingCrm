interface Object {
  [key: string]: any
}

interface LazyStreamRequest<DataGeneric = Object, MetadataGeneric = Object> {
  data?: DataGeneric,
  metadata?: MetadataGeneric,
}

interface LazyStreamResponse<DataGeneric = Object, MetadataGeneric = Object> {
  data: DataGeneric,
  metadata: MetadataGeneric,
}

interface LazyStreamHandler<DataGeneric = Object, MetadataGeneric = Object> {
  (response: LazyStreamResponse<DataGeneric, MetadataGeneric>): void
}

interface LazyStreamSubscription {
  onNext<DataGeneric = Object, MetadataGeneric = Object>(
    handler: LazyStreamHandler<DataGeneric, MetadataGeneric>
  ): void,
  cancel(): void
}

export interface LazyStream {
  (request: LazyStreamRequest): LazyStreamSubscription
}
