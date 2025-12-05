import { useSearchParams } from "react-router";
import type { Route } from "./+types/products";
import { data } from "react-router";
import {
  getAllProducts,
  getProductsByCategory,
  getAllCategories,
} from "../services/product.service";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { formatPrice } from "../lib/utils";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const categorySlug = url.searchParams.get("category");

  try {
    const [categories, products] = await Promise.all([
      getAllCategories(),
      categorySlug ? getProductsByCategory(categorySlug) : getAllProducts(),
    ]);

    return data({
      categories,
      products,
      currentCategory: categorySlug,
    });
  } catch (error) {
    console.error("Error loading products:", error);
    return data({
      categories: [],
      products: [],
      currentCategory: null,
    });
  }
}

export default function Products({ loaderData }: Route.ComponentProps) {
  const { categories, products, currentCategory } = loaderData;
  const [searchParams] = useSearchParams();

  const currentCategoryData = categories.find(
    (cat) => cat.slug === currentCategory
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {currentCategoryData ? currentCategoryData.title : "All Products"}
        </h1>
        {currentCategoryData && (
          <p className="text-lg text-gray-600 mb-6">
            {currentCategoryData.description}
          </p>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Button variant={!currentCategory ? "primary" : "outline"} size="sm">
            <a href="/products">All Products</a>
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={
                currentCategory === category.slug ? "primary" : "outline"
              }
              size="sm"
            >
              <a href={`/products?category=${category.slug}`}>
                {category.title}
              </a>
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600">Try browsing a different category.</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <Card
                key={product.id}
                className="group cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-0">
                  <a href={`/products/${product.id}`}>
                    <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-t-lg overflow-hidden">
                      <img
                        src={product.img_src}
                        alt={product.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600">
                        {product.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary-600">
                          {formatPrice(product.price)}
                        </span>
                        {product.is_on_sale && (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                            Sale
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <p className="text-gray-600">
              Showing {products.length} product
              {products.length !== 1 ? "s" : ""}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
