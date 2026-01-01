#!/bin/bash
# Script de correction checkout pour VPS
# À exécuter depuis /var/www/lasuitechic

echo "=========================================="
echo "  CORRECTION CHECKOUT - LASUITECHIC"
echo "=========================================="
echo ""

# Vérifier qu'on est dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ ERREUR: package.json non trouvé"
    echo "   Vous devez être dans /var/www/lasuitechic"
    exit 1
fi

echo "✓ Répertoire correct"
echo ""

# 1. Créer page /account
echo "📝 [1/7] Création page /account..."
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
              <p className="text-blue-800">La gestion de compte client sera bientôt disponible.</p>
            </div>
            <div className="space-y-4">
              <Button onClick={() => router.push('/products')} variant="outline" className="w-full justify-center">
                Continuer mes achats
              </Button>
              <Button onClick={() => router.push('/admin/login')} variant="outline" className="w-full justify-center">
                Accès Admin
              </Button>
              <Button onClick={() => router.push('/')} className="w-full justify-center">
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

echo "  ✓ Page /account créée"

# 2. Créer dossiers change-password
echo "📝 [2/7] Création dossiers change-password..."
mkdir -p app/admin/change-password
mkdir -p app/api/admin/change-password
echo "  ✓ Dossiers créés"

# 3. Créer API change-password
echo "📝 [3/7] Création API change-password..."
cat > app/api/admin/change-password/route.ts << 'ENDFILE'
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import AdminModel from '@/models/Admin';
import bcrypt from 'bcryptjs';
import { verifyAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    await connectDB();
    const body = await request.json();
    const { currentPassword, newPassword } = body;
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 6 caractères' }, { status: 400 });
    }
    const adminUser = await AdminModel.findById(admin.adminId);
    if (!adminUser) {
      return NextResponse.json({ error: 'Administrateur non trouvé' }, { status: 404 });
    }
    const isValidPassword = await bcrypt.compare(currentPassword, adminUser.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Mot de passe actuel incorrect' }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    adminUser.password = hashedPassword;
    await adminUser.save();
    return NextResponse.json({ message: 'Mot de passe modifié avec succès' });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({ error: 'Erreur lors du changement de mot de passe' }, { status: 500 });
  }
}
ENDFILE

echo "  ✓ API change-password créée"

# 4. Backup checkout
echo "📝 [4/7] Backup checkout..."
cp app/checkout/page.tsx app/checkout/page.tsx.backup.$(date +%Y%m%d_%H%M%S)
echo "  ✓ Backup créé"

# 5. Modifier checkout - formData
echo "📝 [5/7] Modification checkout - formData..."
sed -i "s/fullName: '',/fullName: '',\n    phone: '',\n    address: '',\n    city: '',/" app/checkout/page.tsx
echo "  ✓ formData modifié"

# 6. Modifier checkout - validation
echo "📝 [6/7] Modification checkout - validation..."
sed -i 's/!formData\.wilaya)/!formData.wilaya \&\& formData.address \&\& formData.city)/' app/checkout/page.tsx
echo "  ✓ Validation modifiée"

# 7. Modifier checkout - données API
echo "📝 [7/7] Modification checkout - données API..."
sed -i "s/address: '',$/address: formData.address,/" app/checkout/page.tsx
sed -i "s/city: '',$/city: formData.city,/" app/checkout/page.tsx
echo "  ✓ Données API modifiées"

echo ""
echo "=========================================="
echo "  ✅ MODIFICATIONS TERMINÉES"
echo "=========================================="
echo ""
echo "Les fichiers ont été modifiés."
echo "Voulez-vous builder et redémarrer maintenant? (y/n)"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    echo ""
    echo "🔨 Build en cours..."
    npm run build

    if [ $? -eq 0 ]; then
        echo "  ✓ Build réussi"
        echo ""
        echo "🔄 Redémarrage PM2..."
        pm2 restart lasuitechic
        sleep 3
        echo ""
        echo "📊 Status PM2:"
        pm2 status lasuitechic
        echo ""
        echo "=========================================="
        echo "  ✅ DÉPLOIEMENT TERMINÉ"
        echo "=========================================="
    else
        echo "  ❌ Build échoué"
        echo "  Vérifiez les erreurs ci-dessus"
        exit 1
    fi
else
    echo ""
    echo "Pour builder et redémarrer plus tard:"
    echo "  npm run build && pm2 restart lasuitechic"
fi
