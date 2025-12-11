'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products?limit=100');

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des produits');
      }

      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Erreur lors du chargement des produits');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total stock from variants
  const getTotalStock = (product: any) => {
    if (product.variants && product.variants.length > 0) {
      return product.variants.reduce((total: number, variant: any) => total + (variant.stock || 0), 0);
    }
    return 0;
  };

  // Delete product
  const handleDelete = async (slug: string, name: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${name}" ?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      toast.success('Produit supprimé avec succès !');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Erreur lors de la suppression du produit');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Produits</h1>
        <Link href="/admin/products/new">
          <Button>
            <Plus size={20} className="mr-2" />
            Ajouter un produit
          </Button>
        </Link>
      </div>

      <Card className="p-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Chargement des produits...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun produit trouvé.</p>
              <p className="text-sm text-gray-400 mt-2">
                Cliquez sur "Ajouter un produit" pour commencer.
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left text-sm text-gray-600">
                  <th className="pb-3">Produit</th>
                  <th className="pb-3">Catégorie</th>
                  <th className="pb-3">Prix</th>
                  <th className="pb-3">Stock</th>
                  <th className="pb-3">Statut</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {products.map((product) => {
                  const totalStock = getTotalStock(product);
                  return (
                    <tr key={product._id} className="border-b hover:bg-gray-50">
                      <td className="py-4 font-medium">{product.name}</td>
                      <td className="py-4 capitalize">{product.category}</td>
                      <td className="py-4">{formatPrice(product.price)}</td>
                      <td className="py-4">
                        <span className={totalStock < 10 ? 'text-red-600' : ''}>
                          {totalStock} unités
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          Actif
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/products/${product.slug}`}>
                            <button className="p-2 hover:bg-gray-200 rounded" title="Modifier">
                              <Edit size={16} />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(product.slug, product.name)}
                            className="p-2 hover:bg-red-100 text-red-600 rounded"
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
