import { useState, type ReactElement } from 'react';

import { AdminReorderableList } from '@/components/layout/admin-reorderable-list';
import { ConfirmActionDialog } from '@/components/layout/confirm-action-dialog';
import { useOrderedAdminList } from '@/components/layout/use-ordered-admin-list';
import { Button } from '@/components/ui/button';
import { ProductForm } from '@/features/products-admin/components/product-form';
import { useAdminProductsQuery } from '@/features/products-admin/hooks/use-admin-products-query';
import { useDeleteAdminProductMutation } from '@/features/products-admin/hooks/use-delete-admin-product-mutation';
import { useUpdateAdminProductMutation } from '@/features/products-admin/hooks/use-update-admin-product-mutation';
import type { ProductResponse } from '@/generated/admin-product.contract';
import { getNextDisplayOrder } from '@/lib/get-next-display-order';

export function AdminProductsPage(): ReactElement {
  const productsQuery = useAdminProductsQuery();
  const deleteMutation = useDeleteAdminProductMutation();
  const updateMutation = useUpdateAdminProductMutation();
  const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [productPendingDelete, setProductPendingDelete] = useState<ProductResponse | null>(null);
  const orderedList = useOrderedAdminList({
    items: productsQuery.data?.products,
    onPersist: async (patches) => {
      await Promise.all(
        patches.map((patch) =>
          updateMutation.mutateAsync({
            productId: patch.id,
            body: { displayOrder: patch.displayOrder },
          }),
        ),
      );
    },
  });
  if (productsQuery.isPending) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-medium">Products</h1>
        <p role="status">Loading products…</p>
      </div>
    );
  }
  if (productsQuery.isError || !productsQuery.data) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-medium">Products</h1>
        <p className="text-destructive" role="alert">
          Unable to load products.
        </p>
      </div>
    );
  }
  const { products } = productsQuery.data;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-medium">Products</h1>
        <p className="text-muted-foreground">
          Manage product catalog entries, category assignment, visibility, and images. Drag the list
          to set display order.
        </p>
      </div>
      {editingProduct || isCreating ? (
        <ProductForm
          nextDisplayOrder={getNextDisplayOrder(products)}
          onCancel={() => {
            setEditingProduct(null);
            setIsCreating(false);
          }}
          onSaved={() => {
            setEditingProduct(null);
            setIsCreating(false);
          }}
          product={editingProduct ?? undefined}
        />
      ) : (
        <>
          <div>
            <Button
              onClick={() => {
                setIsCreating(true);
                setEditingProduct(null);
              }}
              type="button"
            >
              Add product
            </Button>
          </div>
          {products.length === 0 ? (
            <p role="status">No products yet. Add the first catalog product.</p>
          ) : (
            <>
              <AdminReorderableList
                disabled={orderedList.isSaving}
                getItemLabel={(product) => product.name}
                items={orderedList.orderedItems}
                onReorder={(nextItems) => {
                  void orderedList.reorder(nextItems);
                }}
                renderItem={(product) => (
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.shortDescription}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.category.name} · {product.isVisible ? 'Visible' : 'Hidden'}
                        {product.partner ? ` · ${product.partner.name}` : ''}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        aria-label={`Edit ${product.name}`}
                        onClick={() => {
                          setEditingProduct(product);
                          setIsCreating(false);
                        }}
                        type="button"
                        variant="outline"
                      >
                        Edit
                      </Button>
                      <Button
                        aria-label={`Delete ${product.name}`}
                        onClick={() => setProductPendingDelete(product)}
                        type="button"
                        variant="outline"
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
      <ConfirmActionDialog
        description={
          productPendingDelete
            ? `This permanently deletes “${productPendingDelete.name}”.`
            : ''
        }
        isPending={deleteMutation.isPending}
        onCancel={() => setProductPendingDelete(null)}
        onConfirm={() => {
          if (!productPendingDelete) {
            return;
          }
          void deleteMutation.mutateAsync(productPendingDelete.id).then(() => {
            setProductPendingDelete(null);
          });
        }}
        open={productPendingDelete !== null}
        title="Delete product?"
      />
    </div>
  );
}
