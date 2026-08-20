export type CreateMediaServiceInput = {
  readonly originalFileName: string;
  readonly mimeType: string;
  readonly content: Buffer;
};

export type MediaFileContent = {
  readonly originalFileName: string;
  readonly mimeType: string;
  readonly content: Buffer;
};
