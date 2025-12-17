'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);

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

  // Handle image upload
  const handleImageUpload = async (index: number, file: File) => {
    if (!file) {
      toast.error('Aucun fichier sélectionné');
      return;
    }

    // Validation côté client
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error(`Type de fichier invalide: ${file.type}. Utilisez JPG, PNG, WEBP ou GIF`);
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error(`Fichier trop volumineux: ${(file.size / 1024 / 1024).toFixed(2)} MB. Maximum: 10 MB`);
      return;
    }

    setUploadingImage(index);
    console.log(`📤 Upload image [${index}]:`, {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024).toFixed(2)} KB`
    });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log(`📥 Réponse upload [${index}]:`, data);

      if (!response.ok) {
        // Gestion détaillée des erreurs
        if (data.receivedType) {
          throw new Error(`${data.error}. Type reçu: ${data.receivedType}`);
        } else if (data.receivedSize) {
          throw new Error(`${data.error}. Taille reçue: ${data.receivedSize}`);
        } else {
          throw new Error(data.error || data.message || 'Erreur lors de l\'upload');
        }
      }

      // Update the image URL in the state
      setImages(prev => {
        const newImages = [...prev];
        newImages[index] = data.url;
        return newImages;
      });

      toast.success(`✅ ${file.name} uploadé avec succès !`);
    } catch (error: any) {
      console.error(`❌ Error uploading image [${index}]:`, error);
      toast.error(error.message || 'Erreur lors de l\'upload de l\'image');
    } finally {
      setUploadingImage(null);
    }
  };

  // Validate and fix image paths
  const validateAndFixImagePaths = (imageUrls: string[]): { fixed: string[], warnings: string[] } => {
    const fixed: string[] = [];
    const warnings: string[] = [];

    imageUrls.forEach((url, index) => {
      if (!url || url.trim() === '') return;

      const trimmedUrl = url.trim();

      // Detect common errors
      if (trimmedUrl.startsWith('/image/')) {
        // Missing 's' in /images/
        const corrected = trimmedUrl.replace('/image/', '/images/');
        fixed.push(corrected);
        warnings.push(`Image ${index + 1}: Corrigé "/image/" → "/images/" (${corrected})`);
      } else if (trimmedUrl.match(/^[A-Z]:\\/i)) {
        // Windows absolute path
        warnings.push(`Image ${index + 1}: Chemin Windows détecté. Utilisez un chemin web (ex: /images/...)`);
      } else if (trimmedUrl.startsWith('\\')) {
        // Backslashes
        warnings.push(`Image ${index + 1}: Utilisez / au lieu de \\ dans les chemins`);
      } else {
        fixed.push(trimmedUrl);
      }
    });

    return { fixed, warnings };
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation côté client
    const validationErrors: string[] = [];

    if (!formData.name || !formData.name.trim()) {
      validationErrors.push('Le nom du produit est requis');
    }

    if (!formData.slug || !formData.slug.trim()) {
      validationErrors.push('Le slug est requis');
    }

    if (!formData.description || !formData.description.trim()) {
      validationErrors.push('La description est requise');
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      validationErrors.push('Le prix doit être supérieur à 0');
    }

    if (!formData.category) {
      validationErrors.push('La catégorie est requise');
    }

    // Filter out empty values
    const rawImages = images.filter(img => img.trim() !== '');
    const filteredSizes = sizes.filter(size => size.trim() !== '');
    const filteredColors = colors.filter(color => color.trim() !== '');
    const filteredVariants = variants.filter(v => v.size && v.color);

    // Validate and fix image paths
    const { fixed: filteredImages, warnings: imageWarnings } = validateAndFixImagePaths(rawImages);

    // Show image path warnings
    if (imageWarnings.length > 0) {
      imageWarnings.forEach(warning => {
        toast.success(`✅ ${warning}`, { duration: 5000 });
      });
    }

    // Validation: au moins une variante
    if (filteredVariants.length === 0) {
      validationErrors.push('Au moins une variante (taille + couleur) est requise');
    }

    // Afficher toutes les erreurs de validation
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error));
      return;
    }

    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
        images: filteredImages.length > 0 ? filteredImages : ['https://via.placeholder.com/400'],
        sizes: filteredSizes,
        colors: filteredColors,
        variants: filteredVariants,
      };

      console.log('📤 Envoi des données produit:', productData);

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();
      console.log('📥 Réponse API:', data);

      if (!response.ok) {
        // Gestion des différents types d'erreurs
        if (data.errors && Array.isArray(data.errors)) {
          // Erreurs multiples
          data.errors.forEach((error: string) => toast.error(error));
          throw new Error('Erreurs de validation');
        } else if (data.error) {
          // Erreur unique
          if (data.suggestion) {
            // Cas spécial: slug déjà utilisé avec suggestion
            toast.error(`${data.error}. Suggestion: ${data.suggestion}`);
          } else {
            toast.error(data.error);
          }
          throw new Error(data.error);
        } else {
          throw new Error('Erreur lors de la création du produit');
        }
      }

      toast.success('✅ Produit créé avec succès !');

      // Redirection après un court délai pour que l'utilisateur voie le message
      setTimeout(() => {
        router.push('/admin/products');
      }, 1000);

    } catch (error: any) {
      console.error('❌ Error creating product:', error);

      // Ne pas afficher de toast si on en a déjà affiché
      if (!error.message.includes('validation')) {
        toast.error(error.message || 'Erreur lors de la création du produit');
      }
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-3xl font-bold">Ajouter un produit</h1>
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
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800 font-medium mb-2">💡 Format des chemins d'images :</p>
                <ul className="text-sm text-blue-700 space-y-1 ml-4">
                  <li>✅ Correct : <code className="bg-blue-100 px-2 py-0.5 rounded">/images/produit.jpg</code></li>
                  <li>❌ Incorrect : <code className="bg-red-100 px-2 py-0.5 rounded">/image/produit.jpg</code> (manque le "s")</li>
                  <li>❌ Incorrect : <code className="bg-red-100 px-2 py-0.5 rounded">C:\ecom\public\images\...</code> (chemin Windows)</li>
                </ul>
              </div>

              <div className="space-y-3">
                {images.map((image, index) => {
                  // Validation en temps réel
                  const hasError = image && (
                    image.startsWith('/image/') ||
                    image.match(/^[A-Z]:\\/i) ||
                    image.startsWith('\\')
                  );
                  const isCorrect = image && image.startsWith('/images/') && !image.includes('\\');

                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex gap-2 items-start">
                        <div className="flex-1">
                          <Input
                            placeholder="URL de l'image ou uploadez une image ci-dessous"
                            value={image}
                            onChange={(e) => handleArrayChange(index, e.target.value, setImages)}
                            className={hasError ? 'border-red-500 focus:ring-red-500' : isCorrect ? 'border-green-500 focus:ring-green-500' : ''}
                          />
                          {hasError && (
                            <p className="text-xs text-red-600 mt-1">
                              ⚠️ Chemin incorrect - Utilisez /images/ au lieu de /image/
                            </p>
                          )}
                          {isCorrect && (
                            <p className="text-xs text-green-600 mt-1">
                              ✓ Chemin correct
                            </p>
                          )}
                        </div>
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
                      <div className="flex gap-2">
                      <label className="flex-1">
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
                  );
                })}
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
                    <option value="enfants">Enfants</option>
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
                  {loading ? 'Création...' : 'Créer le produit'}
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
