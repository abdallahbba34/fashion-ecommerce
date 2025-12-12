// Script pour tester la création d'un produit avec toutes les validations
const productData = {
  name: "Veste en Jean",
  slug: "veste-en-jean",
  description: "Belle veste en jean de qualité supérieure",
  price: 8500,
  compareAtPrice: 12000,
  category: "hommes",
  subcategory: "vestes",
  images: ["/images/jacket.jpg"],
  sizes: ["M", "L", "XL"],
  colors: ["Bleu"],
  variants: [
    { size: "M", color: "Bleu", stock: 5, sku: "VEST-M-BL" },
    { size: "L", color: "Bleu", stock: 8, sku: "VEST-L-BL" },
    { size: "XL", color: "Bleu", stock: 3, sku: "VEST-XL-BL" }
  ],
  material: "100% Coton Denim",
  care: "Lavage en machine à 30°C",
  featured: true,
  newArrival: true,
  bestseller: false
};

async function testCreateProduct() {
  try {
    console.log('\n=== Test création produit complet ===\n');
    console.log('📦 Données du produit:');
    console.log(JSON.stringify(productData, null, 2));
    console.log('\n📤 Envoi de la requête...\n');

    const response = await fetch('http://localhost:3000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    console.log('📥 Réponse HTTP:', response.status, response.statusText);

    const data = await response.json();

    if (!response.ok) {
      console.error('\n❌ ÉCHEC\n');
      console.error('Erreur:', data.error || 'Erreur inconnue');

      if (data.errors && Array.isArray(data.errors)) {
        console.error('Erreurs de validation:');
        data.errors.forEach((err, i) => console.error(`  ${i + 1}. ${err}`));
      }

      if (data.suggestion) {
        console.log('\n💡 Suggestion:', data.suggestion);
      }

      if (data.receivedData) {
        console.log('\nDonnées reçues par le serveur:');
        console.log(JSON.stringify(data.receivedData, null, 2));
      }
    } else {
      console.log('\n✅ SUCCÈS!\n');
      console.log('Produit créé:');
      console.log('  ID:', data.product._id);
      console.log('  Nom:', data.product.name);
      console.log('  Slug:', data.product.slug);
      console.log('  Prix:', data.product.price, 'DA');
      console.log('  Images:', data.product.images.length);
      console.log('  Variantes:', data.product.variants.length);
      console.log('\n✅', data.message || 'Produit créé avec succès!');
    }

  } catch (error) {
    console.error('\n❌ ERREUR RÉSEAU\n');
    console.error('Message:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');
}

testCreateProduct();
