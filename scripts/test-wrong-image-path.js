// Tester avec chemin d'image incorrect
const productData = {
  name: "Test Chaussure",
  slug: "test-chaussure-" + Date.now(),
  description: "Test avec mauvais chemin image",
  price: 3000,
  compareAtPrice: 5000,
  category: "hommes",
  subcategory: "chaussures",
  images: ["/image/chaussure.jpg"], // ERREUR: /image au lieu de /images
  sizes: [],
  colors: [],
  variants: [
    { size: "L", color: "Noir", stock: 20, sku: "PROD-001" }
  ],
  material: "",
  care: "",
  featured: false,
  newArrival: true,
  bestseller: false
};

async function testWrongPath() {
  try {
    console.log('\n🧪 Test avec chemin image incorrect\n');
    console.log('Chemin testé:', productData.images[0]);

    const response = await fetch('http://localhost:3000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log('\n❌ Erreur détectée:', data.error || data.message);
      console.log('Status:', response.status);
    } else {
      console.log('\n⚠️ Produit créé malgré le chemin incorrect');
      console.log('ID:', data.product?._id);
      console.log('\n💡 Le chemin devrait être: /images/chaussure.jpg');
    }

  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
  }
}

testWrongPath();
