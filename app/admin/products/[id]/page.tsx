'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ArrowLeft, Plus, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

interface Variant {
  size: string;
  color: string;
  stock: number;
  sku: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    compareAtPrice: '',
    category: '',
    subcategory: '',
    material: '',
    care: '',
    featured: false,
    newArrival: false,
    bestseller: false,
  });

  const [images, setImages] = useState<string[]>(['']);
  const [sizes, setSizes] = useState<string[]>(['']);
  const [colors, setColors] = useState<string[]>(['']);
  const [variants, setVariants] = useState<Variant[]>([
    { size: '', color: '', stock: 0, sku: '' }
  ]);

  // Load product data
  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoadingProduct(true);
      const response = await fetch(`/api/products/${productId}`);

      if (!response.ok) {
        throw new Error('Produit non trouvé');
      }

      const product = await response.json();

      // Populate form with existing data
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        compareAtPrice: product.compareAtPrice?.toString() || '',
        category: product.category || '',
        subcategory: product.subcategory || '',
        material: product.material || '',
        care: product.care || '',
        featured: product.featured || false,
        newArrival: product.newArrival || false,
        bestseller: product.bestseller || false,
      });

      setImages(product.images && product.images.length > 0 ? product.images : ['']);
      setSizes(product.sizes && product.sizes.length > 0 ? product.sizes : ['']);
      setColors(product.colors && product.colors.length > 0 ? product.colors : ['']);
      setVariants(product.variants && product.variants.length > 0 ? product.variants : [{ size: '', color: '', stock: 0, sku: '' }]);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Erreur lors du chargement du produit');
      router.push('/admin/products');
    } finally {
      setLoadingProduct(false);
    }
  };

  // Handle basic form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  // Handle array fields
  const handleArrayChange = (
    index: number,
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(prev => {
      const newArray = [...prev];
      newArray[index] = value;
      return newArray;
    });
  };

  const addArrayField = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => [...prev, '']);
  };

  const removeArrayField = (
    index: number,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  // Handle image upload
  const handleImageUpload = async (index: number, file: File) => {
    if (!file) return;

    // Validation
    if (file.size > 10 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 10 MB');
      return;
    }

    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Format non supporté. Utilisez JPG, PNG ou WebP');
      return;
    }

    setUploadingImage(index);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'upload');
      }

      const data = await response.json();

      // Update image URL in the array
      handleArrayChange(index, data.url, setImages);

      toast.success('Image uploadée avec succès !');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Erreur lors de l\'upload de l\'image');
    } finally {
      setUploadingImage(null);
    }
  };

  // Handle variants
  const handleVariantChange = (
    index: number,
    field: keyof Variant,
    value: string | number
  ) => {
    setVariants(prev => {
      const newVariants = [...prev];
      newVariants[index] = { ...newVariants[index], [field]: value };
      return newVariants;
    });
  };

  const addVariant = () => {
    setVariants(prev => [...prev, { size: '', color: '', stock: 0, sku: '' }]);
  };

  const removeVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.slug || !formData.description || !formData.price || !formData.category) {
      toast.error('Veuillez remplir tous les champs obligatoires (*)');
      return;
    }

    if (parseFloat(formData.price) <= 0) {
      toast.error('Le prix doit être supérieur à 0');
      return;
    }

    setLoading(true);

    try {
      // Filter out empty values
      const filteredImages = images.filter(img => img.trim() !== '');
      const filteredSizes = sizes.filter(size => size.trim() !== '');
      const filteredColors = colors.filter(color => color.trim() !== '');
      const filteredVariants = variants.filter(v => v.size && v.color);

      // Validation: au moins une variante
      if (filteredVariants.length === 0) {
        toast.error('Veuillez ajouter au moins une variante (taille + couleur)');
        setLoading(false);
        return;
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
        images: filteredImages.length > 0 ? filteredImages : ['https://via.placeholder.com/400'],
        sizes: filteredSizes,
        colors: filteredColors,
        variants: filteredVariants,
      };

      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour du produit');
      }

      toast.success('Produit mis à jour avec succès !');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(error.message || 'Erreur lors de la mise à jour du produit');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Chargement du produit...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="inline-flex items-center text-gray-600 hover:text-black mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          Retour aux produits
        </Link>
        <h1 className="text-3xl font-bold">Modifier le produit</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Informations de base</h2>

              <div className="space-y-4">
                <Input
                  label="Nom du produit *"
                  name="name"
                  value={formData.name}
                  onChange={handleNameChange}
                  required
                  placeholder="ex: Robe Élégante Fleurie"
                />

                <Input
                  label="Slug *"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  placeholder="ex: robe-elegante-fleurie"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Décrivez le produit..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Prix (DA) *"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    placeholder="4500"
                  />

                  <Input
                    label="Prix comparatif (DA)"
                    name="compareAtPrice"
                    type="number"
                    step="0.01"
                    value={formData.compareAtPrice}
                    onChange={handleChange}
                    placeholder="5000"
                  />
                </div>
              </div>
            </Card>

            {/* Images */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Images</h2>
              <p className="text-sm text-gray-600 mb-4">
                Collez les URLs complètes de vos images (ex: https://exemple.com/image.jpg)
              </p>

              <div className="space-y-3">
                {images.map((image, index) => (
                  <div key={index}>
                    <div className="flex gap-2">
                      <Input
                        placeholder="URL de l'image ou uploadez une image ci-dessous"
                        value={image}
                        onChange={(e) => handleArrayChange(index, e.target.value, setImages)}
                      />
                      {images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField(index, setImages)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>

                    {/* Upload button */}
                    <div className="mt-2">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(index, file);
                          }}
                          className="hidden"
                          disabled={uploadingImage === index}
                        />
                        <div className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer flex items-center justify-center text-sm text-gray-600">
                          <Upload size={16} className="mr-2" />
                          {uploadingImage === index ? 'Upload en cours...' : 'Télécharger une image'}
                        </div>
                      </label>
                    </div>

                    {/* Image preview */}
                    {image && (
                      <div className="mt-2">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="h-32 w-32 object-cover rounded border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400';
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField(setImages)}
                  className="text-sm text-gray-600 hover:text-black flex items-center"
                >
                  <Plus size={16} className="mr-1" />
                  Ajouter une image
                </button>
              </div>
            </Card>

            {/* Variants */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Variantes</h2>

              <div className="space-y-4">
                {variants.map((variant, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <Input
                        label="Taille"
                        placeholder="S, M, L, XL"
                        value={variant.size}
                        onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                      />
                      <Input
                        label="Couleur"
                        placeholder="Noir, Blanc, Rouge"
                        value={variant.color}
                        onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Stock"
                        type="number"
                        placeholder="10"
                        value={variant.stock}
                        onChange={(e) => handleVariantChange(index, 'stock', parseInt(e.target.value) || 0)}
                      />
                      <Input
                        label="SKU"
                        placeholder="PROD-001"
                        value={variant.sku}
                        onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                      />
                    </div>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="mt-3 text-sm text-red-600 hover:text-red-800"
                      >
                        Supprimer cette variante
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addVariant}
                  className="text-sm text-gray-600 hover:text-black flex items-center"
                >
                  <Plus size={16} className="mr-1" />
                  Ajouter une variante
                </button>
              </div>
            </Card>

            {/* Details */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Détails</h2>

              <div className="space-y-4">
                <Input
                  label="Matière"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  placeholder="100% Coton"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instructions d'entretien
                  </label>
                  <textarea
                    name="care"
                    value={formData.care}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Lavage en machine à 30°C"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Tailles disponibles
                    </label>
                    <button
                      type="button"
                      onClick={() => setSizes(['XS', 'S', 'M', 'L', 'XL', 'XXL'])}
                      className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      ✓ Toutes les tailles
                    </button>
                  </div>
                  <div className="space-y-2">
                    {sizes.map((size, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="S, M, L, XL"
                          value={size}
                          onChange={(e) => handleArrayChange(index, e.target.value, setSizes)}
                        />
                        {sizes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayField(index, setSizes)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <X size={20} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayField(setSizes)}
                      className="text-sm text-gray-600 hover:text-black flex items-center"
                    >
                      <Plus size={16} className="mr-1" />
                      Ajouter une taille
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Couleurs disponibles
                  </label>
                  <div className="space-y-2">
                    {colors.map((color, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Noir, Blanc, Rouge"
                          value={color}
                          onChange={(e) => handleArrayChange(index, e.target.value, setColors)}
                        />
                        {colors.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayField(index, setColors)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <X size={20} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayField(setColors)}
                      className="text-sm text-gray-600 hover:text-black flex items-center"
                    >
                      <Plus size={16} className="mr-1" />
                      Ajouter une couleur
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Catégorie</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie principale *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="femmes">Femmes</option>
                    <option value="hommes">Hommes</option>
                    <option value="accessoires">Accessoires</option>
                  </select>
                </div>

                <Input
                  label="Sous-catégorie"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  placeholder="ex: Robes, T-shirts"
                />
              </div>
            </Card>

            {/* Product Status */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Statut du produit</h2>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                  />
                  <span className="ml-2 text-sm text-gray-700">Produit en vedette</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="newArrival"
                    checked={formData.newArrival}
                    onChange={handleChange}
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                  />
                  <span className="ml-2 text-sm text-gray-700">Nouvelle arrivée</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="bestseller"
                    checked={formData.bestseller}
                    onChange={handleChange}
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                  />
                  <span className="ml-2 text-sm text-gray-700">Meilleures ventes</span>
                </label>
              </div>
            </Card>

            {/* Actions */}
            <Card className="p-6">
              <div className="space-y-3">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Mise à jour...' : 'Mettre à jour le produit'}
                </Button>
                <Link href="/admin/products" className="block">
                  <Button type="button" variant="outline" className="w-full">
                    Annuler
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
