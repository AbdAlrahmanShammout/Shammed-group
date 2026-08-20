import { useState, type ReactElement } from 'react';

import { ConfirmActionDialog } from '@/components/layout/confirm-action-dialog';
import { Button } from '@/components/ui/button';
import { ProductForm } from '@/features/products-admin/components/product-form';
import { useAdminProductsQuery } from '@/features/products-admin/hooks/use-admin-products-query';
import { useDeleteAdminProductMutation } from '@/features/products-admin/hooks/use-delete-admin-product-mutation';
import type { ProductResponse } from '@/generated/admin-product.contract';

export function AdminProductsPage(): ReactElement {
  const productsQuery = useAdminProductsQuery();
  const deleteMutation = useDeleteAdminProductMutation();
  const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [productPendingDelete, setProductPendingDelete] = useState<ProductResponse | null>(null);
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
          Manage product catalog entries, category assignment, visibility, and images.
        </p>
      </div>
      {editingProduct || isCreating ? (
        <ProductForm
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
            <ul className="flex flex-col gap-4">
              {products.map((product) => (
                <li className="flex flex-col gap-2 border-t pt-4" key={product.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.shortDescription}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.category.name} · {product.isVisible ? 'Visible' : 'Hidden'} · order{' '}
                        {product.displayOrder}
                        {product.partner ? ` · ${product.partner.name}` : ''}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
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
                        onClick={() => setProductPendingDelete(product)}
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
