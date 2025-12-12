// Script pour tester la création d'un produit
const productData = {
  name: "Chaussure en cuir",
  slug: "chaussure-en-cuir",
  description: "chaussure en cuir",
  price: 15000,
  compareAtPrice: 19000,
  category: "hommes",
  subcategory: "chaussures",
  images: ["/images/chaussure.jpg"],
  sizes: [],
  colors: [],
  variants: [
    { size: "43", color: "marron", stock: 0, sku: "" }
  ],
  material: "",
  care: "",
  featured: false,
  newArrival: true,
  bestseller: false
};

async function testCreateProduct() {
  try {
    console.log('\n=== Test création produit ===\n');
    console.log('Données envoyées:', JSON.stringify(productData, null, 2));

    const response = await fetch('http://localhost:3000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    console.log('\nRéponse HTTP:', response.status, response.statusText);

    const data = await response.json();

    if (!response.ok) {
      console.error('\n❌ Erreur:', data.error || data);
    } else {
      console.log('\n✅ Succès! Produit créé:', data);
    }

  } catch (error) {
    console.error('\n❌ Erreur réseau:', error.message);
  }
}

testCreateProduct();
