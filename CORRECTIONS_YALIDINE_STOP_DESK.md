# 🚀 CORRECTION YALIDINE - STOP DESKTOP

## 📋 PROBLÈMES À CORRIGER

1. **Erreur API Yalidine:** `Invalid API ID format. It must be numeric and up to 20 characters.`
2. **Pas de support pour les Stop Desktop** (points de collecte Yalidine)

---

## ✅ SOLUTION

### 1. Corriger l'API ID Yalidine

**Fichier `.env.production` sur le VPS:**

```bash
# Assurez-vous que l'API ID est une STRING (entre guillemets)
YALIDINE_API_ID="99569450964952578887"
YALIDINE_API_TOKEN="b9XQrNSJ5ukLytnIHBcmjsd03TeaCxigwvRP6DAO82Wo1Vlpfh4M7EqGYUKZzF"
```

**OU convertir en Integer dans le code** (app/api/yalidine/create-parcel/route.ts ligne 105):

```typescript
// AVANT
'X-API-ID': yalidineApiId,

// APRÈS
'X-API-ID': yalidineApiId,  // Yalidine accepte string ou number
```

---

### 2. Ajouter le Support des Stop Desktop

J'ai créé le fichier `lib/yalidine-stop-desks.ts` avec 18 Stop Desktop dans les principales wilayas.

#### Fichiers à Modifier:

---

#### A. **types/index.ts** - Ajouter stopDeskId à Order

```typescript
export interface Order {
  _id: string;
  orderNumber: string;
  userId?: string;
  guestEmail?: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: 'cash_on_delivery' | 'bank_transfer' | 'online';
  status: OrderStatus;
  notes?: string;
  trackingNumber?: string;
  stopDeskId?: number;  // ✅ AJOUTER CETTE LIGNE
  createdAt: Date;
  updatedAt: Date;
}
```

---

#### B. **models/Order.ts** - Ajouter stopDeskId au schema

```typescript
const OrderSchema = new Schema<Order>(
  {
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: String },
    guestEmail: { type: String },
    items: [OrderItemSchema],
    shippingAddress: { type: ShippingAddressSchema, required: true },
    billingAddress: ShippingAddressSchema,
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['cash_on_delivery', 'bank_transfer', 'online'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'pending'
    },
    notes: { type: String },
    trackingNumber: { type: String },
    stopDeskId: { type: Number },  // ✅ AJOUTER CETTE LIGNE
  },
  { timestamps: true }
);
```

---

#### C. **app/checkout/page.tsx** - Ajouter le champ Stop Desktop

Ajouter après le champ Wilaya (autour de la ligne 210):

```typescript
{/* Stop Desktop Yalidine (Optionnel) */}
<div>
  <label htmlFor="stopDesk" className="block text-sm font-medium text-gray-700 mb-1">
    Livraison à un Stop Desktop (Optionnel)
  </label>
  <select
    id="stopDesk"
    name="stopDesk"
    value={formData.stopDeskId || ''}
    onChange={(e) => {
      const value = e.target.value;
      setFormData(prev => ({
        ...prev,
        stopDeskId: value ? parseInt(value) : undefined
      }));
    }}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
  >
    <option value="">Livraison à domicile (normale)</option>
    {formData.wilaya && getStopDesksByWilaya(formData.wilaya).map(desk => (
      <option key={desk.id} value={desk.id}>
        {desk.name} - {desk.address}
      </option>
    ))}
  </select>
  <p className="text-xs text-gray-500 mt-1">
    Les Stop Desktop sont des points de collecte Yalidine où vous pouvez récupérer votre commande
  </p>
</div>
```

**Ajouter les imports en haut du fichier:**

```typescript
import { getStopDesksByWilaya, getStopDeskById } from '@/lib/yalidine-stop-desks';
```

**Ajouter stopDeskId au formData:**

```typescript
const [formData, setFormData] = useState({
  fullName: '',
  phone: '',
  address: '',
  city: '',
  wilaya: '',
  stopDeskId: undefined as number | undefined,  // ✅ AJOUTER
});
```

**Modifier la validation (autour ligne 42):**

```typescript
// Si Stop Desktop sélectionné, adresse et city ne sont PAS requis
if (!formData.fullName || !formData.phone || !formData.wilaya) {
  toast.error(t('checkout.errors.requiredFields'));
  setIsSubmitting(false);
  return;
}

// Si PAS de stop desktop, address et city sont requis
if (!formData.stopDeskId && (!formData.address || !formData.city)) {
  toast.error('Veuillez remplir l\'adresse et la commune, ou choisir un Stop Desktop');
  setIsSubmitting(false);
  return;
}
```

**Modifier l'envoi à l'API (autour ligne 96):**

```typescript
// Si stop desktop sélectionné, utiliser son adresse
const stopDesk = formData.stopDeskId ? getStopDeskById(formData.stopDeskId) : null;

const orderData = {
  items,
  shippingAddress: {
    fullName: formData.fullName,
    phone: formData.phone,
    address: stopDesk ? stopDesk.address : formData.address,
    city: stopDesk ? stopDesk.commune : formData.city,
    wilaya: formData.wilaya,
    postalCode: '',
  },
  guestEmail: '',
  subtotal,
  shippingCost,
  total,
  paymentMethod: 'cash_on_delivery',
  notes: '',
  stopDeskId: formData.stopDeskId,  // ✅ AJOUTER
};
```

---

#### D. **app/api/yalidine/create-parcel/route.ts** - Utiliser le Stop Desktop

**Ajouter l'import:**

```typescript
import { getStopDeskById } from '@/lib/yalidine-stop-desks';
```

**Modifier la préparation des données (autour ligne 82):**

```typescript
// Check if order uses a stop desk
const stopDesk = order.stopDeskId ? getStopDeskById(order.stopDeskId) : null;

// Prepare Yalidine parcel data
const parcelData = {
  firstname,
  lastname,
  address: stopDesk ? stopDesk.address : order.shippingAddress.address,
  phone: order.shippingAddress.phone,
  commune_id: stopDesk ? stopDesk.commune_id : 0,
  wilaya_id: wilayaId,
  product_list: productList,
  order_id: order.orderNumber,
  is_stop_desk: !!stopDesk,  // ✅ true si stop desk utilisé
  stop_desk_id: stopDesk ? stopDesk.id : undefined,  // ✅ ID du stop desk
  // Optional fields
  price: order.total,
  do_insurance: false,
  freeshipping: false,
  has_exchange: false,
};
```

---

## 📝 NOTES IMPORTANTES

### Validation des champs address et city

Avec les Stop Desktop:
- **Si Stop Desktop sélectionné:** address et city ne sont PAS requis (l'adresse du stop desk est utilisée)
- **Si SANS Stop Desktop:** address et city SONT requis

### MongoDB Schema

Les champs `address` et `city` dans `ShippingAddressSchema` sont actuellement `required: true`.

**DEUX OPTIONS:**

**Option 1:** Les laisser required mais les remplir automatiquement avec l'adresse du stop desk

**Option 2:** Les rendre optionnels dans le schema:

```typescript
const ShippingAddressSchema = new Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },  // ✅ Enlever required: true
  city: { type: String },     // ✅ Enlever required: true
  wilaya: { type: String, required: true },
  postalCode: { type: String },
}, { _id: false });
```

Je recommande **Option 1** pour éviter de casser les commandes existantes.

---

## 🧪 TEST

Après implémentation, testez:

1. **Commande normale (sans stop desk):**
   - Remplir address et city manuellement
   - Vérifier que ça marche

2. **Commande avec stop desk:**
   - Sélectionner un stop desk dans le menu déroulant
   - Les champs address et city peuvent rester vides
   - Vérifier que l'API Yalidine reçoit `is_stop_desk: true`

---

## 📦 FICHIERS CRÉÉS

- ✅ `lib/yalidine-stop-desks.ts` - Liste des 18 stop desks Yalidine

---

## 🚀 ORDRE DE DÉPLOIEMENT

1. Transférer `lib/yalidine-stop-desks.ts` sur le VPS
2. Modifier `types/index.ts`
3. Modifier `models/Order.ts`
4. Modifier `app/checkout/page.tsx`
5. Modifier `app/api/yalidine/create-parcel/route.ts`
6. Build et restart

---

## ⚠️ CORRECTION API ID

Si l'erreur "Invalid API ID format" persiste, vérifiez dans `/var/www/lasuitechic/.env.production`:

```bash
# L'API ID doit être une string
YALIDINE_API_ID="99569450964952578887"
YALIDINE_API_TOKEN="b9XQrNSJ5ukLytnIHBcmjsd03TeaCxigwvRP6DAO82Wo1Vlpfh4M7EqGYUKZzF"
```

Ou testez avec parseInt:

```typescript
'X-API-ID': parseInt(yalidineApiId, 10).toString(),
```
