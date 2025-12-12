// Tester la correction automatique des chemins d'images
console.log('\n🧪 Test de correction automatique des chemins d\'images\n');

// Simulation de la fonction de validation
function validateAndFixImagePaths(imageUrls) {
  const fixed = [];
  const warnings = [];

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
}

// Tests
const testCases = [
  {
    name: 'Chemin incorrect /image/',
    input: ['/image/chaussure.jpg'],
    expected: '/images/chaussure.jpg'
  },
  {
    name: 'Chemin correct /images/',
    input: ['/images/chaussure.jpg'],
    expected: '/images/chaussure.jpg'
  },
  {
    name: 'Chemin Windows',
    input: ['C:\\ecom\\public\\images\\test.jpg'],
    expected: null // Pas de correction, juste un warning
  },
  {
    name: 'Backslashes',
    input: ['\\public\\images\\test.jpg'],
    expected: null
  },
  {
    name: 'Multiple images avec erreurs',
    input: ['/image/img1.jpg', '/images/img2.jpg', '/image/img3.jpg'],
    expected: ['/images/img1.jpg', '/images/img2.jpg', '/images/img3.jpg']
  }
];

testCases.forEach(test => {
  console.log(`\n📋 Test: ${test.name}`);
  console.log(`  Input: ${JSON.stringify(test.input)}`);

  const result = validateAndFixImagePaths(test.input);

  console.log(`  Résultat: ${JSON.stringify(result.fixed)}`);

  if (result.warnings.length > 0) {
    console.log(`  ⚠️  Warnings:`);
    result.warnings.forEach(w => console.log(`     - ${w}`));
  }

  if (test.expected) {
    const success = JSON.stringify(result.fixed) === JSON.stringify(Array.isArray(test.expected) ? test.expected : [test.expected]);
    console.log(`  ${success ? '✅ PASS' : '❌ FAIL'}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log('✅ Tests terminés\n');
