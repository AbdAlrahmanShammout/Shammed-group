import { useState, type ReactElement } from 'react';

import { ApiError } from '@/api/api-error';
import { ConfirmActionDialog } from '@/components/layout/confirm-action-dialog';
import { Button } from '@/components/ui/button';
import { CategoryForm } from '@/features/categories/components/category-form';
import { CategoryReplacementDialog } from '@/features/categories/components/category-replacement-dialog';
import { useAdminProductCategoriesQuery } from '@/features/categories/hooks/use-admin-product-categories-query';
import { useDeleteAdminProductCategoryMutation } from '@/features/categories/hooks/use-delete-admin-product-category-mutation';
import type { ProductCategoryResponse } from '@/generated/admin-product-category.contract';

const OCCUPIED_CATEGORY_CODE = 'PRODUCT_CATEGORY_OCCUPIED';
const LAST_OCCUPIED_CATEGORY_CODE = 'PRODUCT_CATEGORY_LAST_OCCUPIED';

export function AdminCategoriesPage(): ReactElement {
  const categoriesQuery = useAdminProductCategoriesQuery();
  const deleteMutation = useDeleteAdminProductCategoryMutation();
  const [editingCategory, setEditingCategory] = useState<ProductCategoryResponse | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [categoryPendingDelete, setCategoryPendingDelete] = useState<ProductCategoryResponse | null>(
    null,
  );
  const [categoryNeedingReplacement, setCategoryNeedingReplacement] =
    useState<ProductCategoryResponse | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
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
          Manage product categories. Deleting a category that still has products requires choosing a
          replacement.
        </p>
      </div>
      {editingCategory || isCreating ? (
        <CategoryForm
          category={editingCategory ?? undefined}
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
            <ul className="flex flex-col gap-4">
              {productCategories.map((category) => (
                <li className="flex flex-col gap-2 border-t pt-4" key={category.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">{category.name}</p>
                      {category.description ? (
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      ) : null}
                      <p className="text-sm text-muted-foreground">
                        {category.isVisible ? 'Visible' : 'Hidden'} · order {category.displayOrder}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
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
                        onClick={() => {
                          setDeleteError(null);
                          setCategoryPendingDelete(category);
                        }}
                        type="button"
                        variant="outline"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
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
