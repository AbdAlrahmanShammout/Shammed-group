export type StoreFileInput = {
  readonly originalFileName: string;
  readonly mimeType: string;
  readonly content: Buffer;
};

export type StoredFile = {
  readonly originalFileName: string;
  readonly storedFileName: string;
  readonly mimeType: string;
  readonly byteSize: number;
  readonly storageKey: string;
};
