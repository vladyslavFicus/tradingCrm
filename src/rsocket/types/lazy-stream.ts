type DefaultObject = Record<string, any>

interface LazyStreamRequest<DataGeneric = DefaultObject, MetadataGeneric = DefaultObject> {
  data?: DataGeneric,
  metadata?: MetadataGeneric,
}

interface LazyStreamResponse<DataGeneric = DefaultObject, MetadataGeneric = DefaultObject> {
  data: DataGeneric,
  metadata: MetadataGeneric,
}

interface LazyStreamHandler<DataGeneric = DefaultObject, MetadataGeneric = DefaultObject> {
  (response: LazyStreamResponse<DataGeneric, MetadataGeneric>): void
}

export interface LazyStreamSubscription {
  onNext<DataGeneric = DefaultObject, MetadataGeneric = DefaultObject>(
    handler: LazyStreamHandler<DataGeneric, MetadataGeneric>
  ): void,
  cancel(): void
}

export interface LazyStream {
  (request: LazyStreamRequest): LazyStreamSubscription
}
