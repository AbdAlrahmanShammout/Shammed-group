export class BaseEntity {
  id!: number;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date | null;
}

export type OptionalRelations<T> = {
  [K in keyof T]: T[K] extends object | null | undefined ? T[K] | undefined : T[K];
};
