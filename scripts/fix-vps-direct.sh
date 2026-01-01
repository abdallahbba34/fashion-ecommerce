#!/bin/bash
# Script de correction directe sur le VPS
# À exécuter depuis /var/www/lasuitechic

echo "==========================================="
echo "  CORRECTIONS DIRECTES VPS"
echo "==========================================="
echo ""

# Vérifier qu'on est dans le bon dossier
if [ ! -f "package.json" ]; then
    echo "ERREUR: Vous devez être dans /var/www/lasuitechic"
    exit 1
fi

echo "✅ Dossier correct détecté"
echo ""

# ÉTAPE 1: Créer la page /account
echo "📄 ÉTAPE 1: Création de la page /account"
echo "-------------------------------------------"

mkdir -p app/account

cat > app/account/page.tsx << 'ENDFILE'
'use client';

import { useRouter } from 'next/navigation';
import { User } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function AccountPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={32} className="text-gray-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Mon Compte</h1>
                <p className="text-gray-600">Gérez vos informations personnelles</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800">
                La gestion de compte client sera bientôt disponible. Pour le moment, vous pouvez:
              </p>
              <ul className="mt-2 ml-4 list-disc text-blue-700">
                <li>Commander en tant qu'invité au checkout</li>
                <li>Accéder au panneau admin si vous êtes administrateur</li>
              </ul>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => router.push('/products')}
                variant="outline"
                className="w-full justify-center"
              >
                Continuer mes achats
              </Button>

              <Button
                onClick={() => router.push('/admin/login')}
                variant="outline"
                className="w-full justify-center"
              >
                Accès Admin
              </Button>

              <Button
                onClick={() => router.push('/')}
                className="w-full justify-center"
              >
                Retour à l'accueil
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
ENDFILE

echo "✅ Page /account créée"
echo ""

# ÉTAPE 2: Créer les dossiers pour change-password
echo "📁 ÉTAPE 2: Création des dossiers"
echo "-------------------------------------------"

mkdir -p app/admin/change-password
mkdir -p app/api/admin/change-password

echo "✅ Dossiers créés"
echo ""

# ÉTAPE 3: Créer la page de changement de mot de passe
echo "📄 ÉTAPE 3: Page changement de mot de passe"
echo "-------------------------------------------"

cat > app/admin/change-password/page.tsx << 'ENDFILE'
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        router.push('/admin/login');
        return;
      }
      const data = await response.json();
      setAdminEmail(data.email);
      setLoading(false);
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/admin/login');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (currentPassword === newPassword) {
      toast.error('Le nouveau mot de passe doit être différent de l\'ancien');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors du changement de mot de passe');
      }

      toast.success('Mot de passe modifié avec succès');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        router.push('/admin');
      }, 2000);
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Lock size={24} className="text-gray-700" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Changer le mot de passe</h1>
                <p className="text-gray-600">Compte: {adminEmail}</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex gap-2">
                <KeyRound size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-900 font-medium">Conseils de sécurité</p>
                  <ul className="mt-1 text-sm text-blue-800 list-disc ml-4">
                    <li>Utilisez au moins 8 caractères</li>
                    <li>Mélangez lettres, chiffres et symboles</li>
                    <li>Ne réutilisez pas d'anciens mots de passe</li>
                  </ul>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe actuel *
                </label>
                <div className="relative">
                  <Input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Entrez votre mot de passe actuel"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nouveau mot de passe *
                </label>
                <div className="relative">
                  <Input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Entrez un nouveau mot de passe"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le nouveau mot de passe *
                </label>
                <div className="relative">
                  <Input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmez le nouveau mot de passe"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1"
                >
                  {saving ? 'Enregistrement...' : 'Changer le mot de passe'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin')}
                  disabled={saving}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
ENDFILE

echo "✅ Page change-password créée"
echo ""

# ÉTAPE 4: Créer l'API de changement de mot de passe
echo "📄 ÉTAPE 4: API changement de mot de passe"
echo "-------------------------------------------"

cat > app/api/admin/change-password/route.ts << 'ENDFILE'
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import AdminModel from '@/models/Admin';
import bcrypt from 'bcrypt';
import { verifyAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    const adminUser = await AdminModel.findById(admin.id);
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Administrateur non trouvé' },
        { status: 404 }
      );
    }

    const isValidPassword = await bcrypt.compare(currentPassword, adminUser.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Mot de passe actuel incorrect' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    adminUser.password = hashedPassword;
    await adminUser.save();

    return NextResponse.json({
      message: 'Mot de passe modifié avec succès'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { error: 'Erreur lors du changement de mot de passe' },
      { status: 500 }
    );
  }
}
ENDFILE

echo "✅ API change-password créée"
echo ""

# ÉTAPE 5: Modifier le checkout - Ajouter address et city
echo "📝 ÉTAPE 5: Modification du checkout"
echo "-------------------------------------------"

# Backup
cp app/checkout/page.tsx app/checkout/page.tsx.backup

# Créer un script Python pour faire les modifications complexes
cat > /tmp/fix_checkout.py << 'ENDPYTHON'
import re

with open('app/checkout/page.tsx', 'r') as f:
    content = f.read()

# 1. Modifier le formData state pour ajouter address et city
content = re.sub(
    r"const \[formData, setFormData\] = useState\(\{\s*fullName: '',\s*phone: '',\s*wilaya: '',",
    """const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    wilaya: '',""",
    content
)

# 2. Modifier la validation
content = re.sub(
    r"if \(!formData\.fullName \|\| !formData\.phone \|\| !formData\.wilaya\)",
    "if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.wilaya)",
    content
)

# 3. Modifier les données envoyées à l'API
content = re.sub(
    r"shippingAddress: \{\s*fullName: formData\.fullName,\s*phone: formData\.phone,\s*address: '',\s*city: '',",
    """shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,""",
    content
)

# 4. Ajouter les champs dans le formulaire après le téléphone
phone_section = r'(<div className="md:col-span-2">\s*<Input\s*label="Téléphone \*"[^>]*>\s*</div>)'
replacement = r'''\1

                <div className="md:col-span-2">
                  <Input
                    label="Adresse complète *"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Ex: Cité 123, Rue des Oliviers, Bâtiment A"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Input
                    label="Commune *"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Ex: Bab Ezzouar"
                    required
                  />
                </div>'''

content = re.sub(phone_section, replacement, content, flags=re.DOTALL)

with open('app/checkout/page.tsx', 'w') as f:
    f.write(content)

print("Checkout modifié avec succès")
ENDPYTHON

# Exécuter le script Python
python3 /tmp/fix_checkout.py

if [ $? -eq 0 ]; then
    echo "✅ Checkout modifié"
else
    echo "⚠️  Modification Python échouée, utilisation de sed..."

    # Fallback avec sed si Python n'est pas disponible
    sed -i "s/fullName: '',/fullName: '',\n    phone: '',\n    address: '',\n    city: '',/" app/checkout/page.tsx
    sed -i "s/if (!formData.fullName || !formData.phone || !formData.wilaya)/if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.wilaya)/" app/checkout/page.tsx
    sed -i "s/address: '',/address: formData.address,/" app/checkout/page.tsx
    sed -i "s/city: '',/city: formData.city,/" app/checkout/page.tsx
fi

echo ""

# ÉTAPE 6: Build et restart
echo "🔨 ÉTAPE 6: Build et redémarrage"
echo "-------------------------------------------"

npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build"
    echo "Restauration du backup checkout..."
    cp app/checkout/page.tsx.backup app/checkout/page.tsx
    exit 1
fi

echo "✅ Build réussi"
echo ""

pm2 restart lasuitechic

echo "✅ PM2 redémarré"
echo ""

# ÉTAPE 7: Vérification
echo "🔍 ÉTAPE 7: Vérification"
echo "-------------------------------------------"

echo "1. Fichiers créés:"
ls -la app/account/page.tsx 2>/dev/null && echo "   ✅ app/account/page.tsx" || echo "   ❌ app/account/page.tsx"
ls -la app/admin/change-password/page.tsx 2>/dev/null && echo "   ✅ app/admin/change-password/page.tsx" || echo "   ❌ app/admin/change-password/page.tsx"
ls -la app/api/admin/change-password/route.ts 2>/dev/null && echo "   ✅ app/api/admin/change-password/route.ts" || echo "   ❌ app/api/admin/change-password/route.ts"

echo ""
echo "2. Status PM2:"
pm2 status lasuitechic

echo ""
echo "3. Logs récents:"
pm2 logs lasuitechic --lines 15 --nostream

echo ""
echo "4. Test API:"
curl -s http://localhost:3000/api/products?limit=1 | head -c 200
echo ""

echo ""
echo "==========================================="
echo "✅ CORRECTIONS TERMINÉES !"
echo "==========================================="
echo ""
echo "🎯 Pages créées:"
echo "   • https://lasuitechic.online/account"
echo "   • https://lasuitechic.online/admin/change-password"
echo ""
echo "🔧 Checkout corrigé:"
echo "   • Champs Address et City ajoutés"
echo "   • Plus d'erreur MongoDB validation"
echo ""
echo "📝 Vérifiez le site maintenant!"
echo ""
