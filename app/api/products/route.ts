import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import ProductModel from '@/models/Product';

// GET /api/products - Get all products
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const filter = searchParams.get('filter');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    const query: any = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (filter === 'new') {
      query.newArrival = true;
    } else if (filter === 'sale') {
      query.compareAtPrice = { $exists: true, $ne: null };
    } else if (filter === 'featured') {
      query.featured = true;
    }

    const products = await ProductModel
      .find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await ProductModel.countDocuments(query);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product (Admin only)
export async function POST(request: NextRequest) {
  try {
    console.log('[Products] POST - Début création produit');
    await connectDB();

    const body = await request.json();
    console.log('[Products] Données reçues:', {
      name: body.name,
      category: body.category,
      price: body.price,
      variants: body.variants?.length || 0
    });

    // Validation basique
    const errors = [];

    if (!body.name || body.name.trim() === '') {
      errors.push('Le nom du produit est requis');
    }

    if (!body.slug || body.slug.trim() === '') {
      errors.push('Le slug est requis');
    }

    if (!body.description || body.description.trim() === '') {
      errors.push('La description est requise');
    }

    if (!body.price || body.price <= 0) {
      errors.push('Le prix doit être supérieur à 0');
    }

    if (!body.category || body.category.trim() === '') {
      errors.push('La catégorie est requise');
    }

    if (!body.variants || body.variants.length === 0) {
      errors.push('Au moins une variante est requise');
    }

    if (errors.length > 0) {
      console.error('[Products] ❌ Erreurs de validation:', errors);
      return NextResponse.json(
        {
          error: 'Erreurs de validation',
          errors,
          receivedData: {
            name: body.name,
            slug: body.slug,
            category: body.category,
            price: body.price,
            variants: body.variants?.length || 0
          }
        },
        { status: 400 }
      );
    }

    // Vérifier si le slug existe déjà
    const existingProduct = await ProductModel.findOne({ slug: body.slug });
    if (existingProduct) {
      console.error('[Products] ❌ Slug déjà utilisé:', body.slug);
      return NextResponse.json(
        {
          error: 'Un produit avec ce slug existe déjà',
          slug: body.slug,
          suggestion: `${body.slug}-${Date.now()}`
        },
        { status: 409 }
      );
    }

    const product = await ProductModel.create(body);
    console.log('[Products] ✅ Produit créé:', product._id);

    return NextResponse.json({
      success: true,
      product,
      message: 'Produit créé avec succès'
    }, { status: 201 });

  } catch (error: any) {
    console.error('[Products] ❌ Erreur création produit:', error);

    // Gestion des erreurs MongoDB
    if (error.code === 11000) {
      return NextResponse.json(
        {
          error: 'Un produit avec ces informations existe déjà',
          field: Object.keys(error.keyPattern || {})[0],
          message: 'Valeur dupliquée détectée'
        },
        { status: 409 }
      );
    }

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors || {}).map((err: any) => err.message);
      return NextResponse.json(
        {
          error: 'Erreur de validation MongoDB',
          errors: validationErrors,
          details: error.message
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Erreur lors de la création du produit',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
