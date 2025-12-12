// Script pour tester toutes les validations d'erreur
const invalidProducts = [
  {
    name: 'Test sans slug',
    data: {
      name: "Produit Test",
      // slug manquant
      description: "Description",
      price: 1000,
      category: "hommes",
      variants: [{ size: "M", color: "Noir", stock: 5, sku: "" }]
    }
  },
  {
    name: 'Test sans prix',
    data: {
      name: "Produit Test",
      slug: "test-sans-prix",
      description: "Description",
      // price manquant
      category: "hommes",
      variants: [{ size: "M", color: "Noir", stock: 5, sku: "" }]
    }
  },
  {
    name: 'Test prix négatif',
    data: {
      name: "Produit Test",
      slug: "test-prix-negatif",
      description: "Description",
      price: -100,
      category: "hommes",
      variants: [{ size: "M", color: "Noir", stock: 5, sku: "" }]
    }
  },
  {
    name: 'Test sans variantes',
    data: {
      name: "Produit Test",
      slug: "test-sans-variantes",
      description: "Description",
      price: 1000,
      category: "hommes",
      variants: [] // pas de variantes
    }
  },
  {
    name: 'Test multiple erreurs',
    data: {
      name: "", // vide
      slug: "",  // vide
      description: "", // vide
      price: 0, // invalide
      category: "", // vide
      variants: [] // vide
    }
  }
];

async function testValidations() {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 TEST DES VALIDATIONS D\'ERREUR');
  console.log('='.repeat(60) + '\n');

  for (const test of invalidProducts) {
    console.log(`\n📋 Test: ${test.name}`);
    console.log('-'.repeat(60));

    try {
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(test.data),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log('✅ Erreur détectée (Status:', response.status + ')');
        console.log('   Message:', data.error);

        if (data.errors && Array.isArray(data.errors)) {
          console.log('   Erreurs:');
          data.errors.forEach((err, i) => {
            console.log(`      ${i + 1}. ${err}`);
          });
        }
      } else {
        console.log('❌ PROBLÈME: Validation manquée!');
      }

    } catch (error) {
      console.log('❌ Erreur réseau:', error.message);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Tests de validation terminés!');
  console.log('='.repeat(60) + '\n');
}

testValidations();
