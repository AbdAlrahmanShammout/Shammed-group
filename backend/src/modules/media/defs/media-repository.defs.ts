export type CreateMediaRepoInput = {
  readonly originalFileName: string;
  readonly storedFileName: string;
  readonly mimeType: string;
  readonly byteSize: number;
  readonly storageKey: string;
};
