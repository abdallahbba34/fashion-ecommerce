// Script pour tester la gestion des slugs dupliqués
const productData = {
  name: "Veste en Jean 2",
  slug: "veste-en-jean", // Slug déjà utilisé
  description: "Autre veste en jean",
  price: 9000,
  category: "hommes",
  subcategory: "vestes",
  images: ["/images/jacket.jpg"],
  sizes: [],
  colors: [],
  variants: [
    { size: "M", color: "Noir", stock: 5, sku: "" }
  ],
  material: "",
  care: "",
  featured: false,
  newArrival: false,
  bestseller: false
};

async function testDuplicateSlug() {
  try {
    console.log('\n=== Test slug dupliqué ===\n');
    console.log('🔄 Tentative de création avec slug existant:', productData.slug);

    const response = await fetch('http://localhost:3000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log('\n✅ Validation fonctionnelle!\n');
      console.log('Status:', response.status);
      console.log('Erreur:', data.error);
      if (data.suggestion) {
        console.log('💡 Suggestion de slug:', data.suggestion);
      }
    } else {
      console.log('\n❌ PROBLÈME: Le slug dupliqué n\'a pas été détecté!\n');
    }

  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
  }
}

testDuplicateSlug();
