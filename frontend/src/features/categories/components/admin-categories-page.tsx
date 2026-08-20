import { useState, type ReactElement } from 'react';

import { ApiError } from '@/api/api-error';
import { AdminReorderableList } from '@/components/layout/admin-reorderable-list';
import { AdminVisibilitySwitch } from '@/components/layout/admin-visibility-switch';
import { ConfirmActionDialog } from '@/components/layout/confirm-action-dialog';
import { useOrderedAdminList } from '@/components/layout/use-ordered-admin-list';
import { Button } from '@/components/ui/button';
import { CategoryForm } from '@/features/categories/components/category-form';
import { CategoryReplacementDialog } from '@/features/categories/components/category-replacement-dialog';
import { useAdminProductCategoriesQuery } from '@/features/categories/hooks/use-admin-product-categories-query';
import { useDeleteAdminProductCategoryMutation } from '@/features/categories/hooks/use-delete-admin-product-category-mutation';
import { useUpdateAdminProductCategoryMutation } from '@/features/categories/hooks/use-update-admin-product-category-mutation';
import type { ProductCategoryResponse } from '@/generated/admin-product-category.contract';
import { getNextDisplayOrder } from '@/lib/get-next-display-order';

const OCCUPIED_CATEGORY_CODE = 'PRODUCT_CATEGORY_OCCUPIED';
const LAST_OCCUPIED_CATEGORY_CODE = 'PRODUCT_CATEGORY_LAST_OCCUPIED';

export function AdminCategoriesPage(): ReactElement {
  const categoriesQuery = useAdminProductCategoriesQuery();
  const deleteMutation = useDeleteAdminProductCategoryMutation();
  const updateMutation = useUpdateAdminProductCategoryMutation();
  const [editingCategory, setEditingCategory] = useState<ProductCategoryResponse | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [categoryPendingDelete, setCategoryPendingDelete] = useState<ProductCategoryResponse | null>(
    null,
  );
  const [categoryNeedingReplacement, setCategoryNeedingReplacement] =
    useState<ProductCategoryResponse | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [visibilityPendingId, setVisibilityPendingId] = useState<number | null>(null);
  const orderedList = useOrderedAdminList({
    items: categoriesQuery.data?.productCategories,
    onPersist: async (patches) => {
      await Promise.all(
        patches.map((patch) =>
          updateMutation.mutateAsync({
            categoryId: patch.id,
            body: { displayOrder: patch.displayOrder },
          }),
        ),
      );
    },
  });
  async function executeVisibilityChange(input: {
    readonly categoryId: number;
    readonly isVisible: boolean;
  }): Promise<void> {
    setVisibilityPendingId(input.categoryId);
    try {
      await updateMutation.mutateAsync({
        categoryId: input.categoryId,
        body: { isVisible: input.isVisible },
      });
    } finally {
      setVisibilityPendingId(null);
    }
  }
  async function executeDelete(input: {
    readonly category: ProductCategoryResponse;
    readonly replacementCategoryId?: number;
  }): Promise<void> {
    setDeleteError(null);
    try {
      await deleteMutation.mutateAsync({
        categoryId: input.category.id,
        replacementCategoryId: input.replacementCategoryId,
      });
      setCategoryPendingDelete(null);
      setCategoryNeedingReplacement(null);
    } catch (error) {
      if (!(error instanceof ApiError)) {
        setDeleteError('Unable to delete the category.');
        return;
      }
      if (error.code === OCCUPIED_CATEGORY_CODE) {
        setCategoryPendingDelete(null);
        setCategoryNeedingReplacement(input.category);
        return;
      }
      setDeleteError(error.message);
      if (error.code === LAST_OCCUPIED_CATEGORY_CODE) {
        setCategoryPendingDelete(null);
      }
    }
  }
  if (categoriesQuery.isPending) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-medium">Categories</h1>
        <p role="status">Loading categories…</p>
      </div>
    );
  }
  if (categoriesQuery.isError || !categoriesQuery.data) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-medium">Categories</h1>
        <p className="text-destructive" role="alert">
          Unable to load categories.
        </p>
      </div>
    );
  }
  const { productCategories } = categoriesQuery.data;
  const replacementOptions = productCategories.filter(
    (category) => category.id !== categoryNeedingReplacement?.id,
  );
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-medium">Categories</h1>
        <p className="text-muted-foreground">
          Manage product categories. Drag the list to set display order. Deleting a category that
          still has products requires choosing a replacement.
        </p>
      </div>
      {editingCategory || isCreating ? (
        <CategoryForm
          category={editingCategory ?? undefined}
          nextDisplayOrder={getNextDisplayOrder(productCategories)}
          onCancel={() => {
            setEditingCategory(null);
            setIsCreating(false);
          }}
          onSaved={() => {
            setEditingCategory(null);
            setIsCreating(false);
          }}
        />
      ) : (
        <>
          <div>
            <Button
              onClick={() => {
                setIsCreating(true);
                setEditingCategory(null);
              }}
              type="button"
            >
              Add category
            </Button>
          </div>
          {productCategories.length === 0 ? (
            <p role="status">No categories yet. Add the first product category.</p>
          ) : (
            <>
              <AdminReorderableList
                disabled={orderedList.isSaving}
                getItemLabel={(category) => category.name}
                items={orderedList.orderedItems}
                onReorder={(nextItems) => {
                  void orderedList.reorder(nextItems);
                }}
                renderItem={(category) => (
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">{category.name}</p>
                      {category.description ? (
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <AdminVisibilitySwitch
                        checked={category.isVisible}
                        disabled={visibilityPendingId === category.id || orderedList.isSaving}
                        entityLabel={category.name}
                        itemId={category.id}
                        onCheckedChange={(isVisible) => {
                          void executeVisibilityChange({ categoryId: category.id, isVisible });
                        }}
                      />
                      <Button
                        aria-label={`Edit ${category.name}`}
                        onClick={() => {
                          setEditingCategory(category);
                          setIsCreating(false);
                        }}
                        type="button"
                        variant="outline"
                      >
                        Edit
                      </Button>
                      <Button
                        aria-label={`Delete ${category.name}`}
                        onClick={() => {
                          setDeleteError(null);
                          setCategoryPendingDelete(category);
                        }}
                        type="button"
                        variant="destructive"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              />
              {orderedList.isSaving ? (
                <p className="text-sm text-muted-foreground" role="status">
                  Saving order…
                </p>
              ) : null}
              {orderedList.error ? (
                <p className="text-sm text-destructive" role="alert">
                  {orderedList.error}
                </p>
              ) : null}
            </>
          )}
        </>
      )}
      {deleteError && !categoryNeedingReplacement ? (
        <p className="text-sm text-destructive" role="alert">
          {deleteError}
        </p>
      ) : null}
      <ConfirmActionDialog
        description={
          categoryPendingDelete
            ? `This deletes “${categoryPendingDelete.name}”. If it still has products, you will be asked to choose a replacement category.`
            : ''
        }
        isPending={deleteMutation.isPending}
        onCancel={() => setCategoryPendingDelete(null)}
        onConfirm={() => {
          if (!categoryPendingDelete) {
            return;
          }
          void executeDelete({ category: categoryPendingDelete });
        }}
        open={categoryPendingDelete !== null}
        title="Delete category?"
      />
      {categoryNeedingReplacement ? (
        <CategoryReplacementDialog
          category={categoryNeedingReplacement}
          isPending={deleteMutation.isPending}
          onCancel={() => {
            setCategoryNeedingReplacement(null);
            setDeleteError(null);
          }}
          onConfirm={(replacementCategoryId) => {
            void executeDelete({
              category: categoryNeedingReplacement,
              replacementCategoryId,
            });
          }}
          replacementOptions={replacementOptions}
          serverError={deleteError}
        />
      ) : null}
    </div>
  );
}
