import type { Route } from "./+types/home";
import { data, redirect } from "react-router";
import {
  getAllCategories,
  getFeaturedProducts,
} from "../services/product.service";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { formatPrice } from "../lib/utils";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const [categories, featuredProducts] = await Promise.all([
      getAllCategories(),
      getFeaturedProducts(8),
    ]);

    return data({ categories, featuredProducts });
  } catch (error) {
    console.error("Error loading home page:", error);
    throw redirect("/");
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { categories, featuredProducts } = loaderData;

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Gear for Developers
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Express your passion for coding with our exclusive collection of
              developer merchandise. From stylish polos to creative stickers and
              coffee mugs.
            </p>
            <Button size="lg" variant="secondary">
              <a href="/products" className="text-gray-900">
                Shop Now
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600">
            Find the perfect developer gear for every coding style
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="group cursor-pointer hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-0">
                <a href={`/products?category=${category.slug}`}>
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-lg">
                    <img
                      src={category.img_src}
                      alt={category.title}
                      className="w-full h-12 object-cover rounded-t-lg group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {category.title}
                    </h3>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600">
            Our most popular items that developers love
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card
              key={product.id}
              className="group cursor-pointer hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-0">
                <a href={`/products/${product.id}`}>
                  <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-t-lg">
                    <img
                      src={product.img_src}
                      alt={product.title}
                      className="w-full h-12 object-cover rounded-t-lg group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {product.title}
                    </h3>
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

        <div className="text-center mt-10">
          <Button variant="outline">
            <a href="/products">View All Products</a>
          </Button>
        </div>
      </section>
    </div>
  );
}
