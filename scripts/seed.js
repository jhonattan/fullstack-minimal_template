import { pool } from "../app/lib/db.ts";

const categories = [
  {
    title: "Polos",
    slug: "polos",
    description:
      "Polos exclusivos con diseños que todo desarrollador querrá lucir.",
    img_src: "/images/polos.jpg",
  },
  {
    title: "Tazas",
    slug: "tazas",
    description:
      "Tazas que combinan perfectamente con tu café matutino y tu pasión por la programación.",
    img_src: "/images/tazas.jpg",
  },
  {
    title: "Stickers",
    slug: "stickers",
    description:
      "Personaliza tu espacio de trabajo con nuestros stickers únicos.",
    img_src: "/images/stickers.jpg",
  },
];

const products = [
  {
    title: "Polo React",
    price: 20.0,
    description: "Viste tu pasión por React con estilo y comodidad.",
    img_src: "/images/polo-react.png",
    category_id: 1,
    is_on_sale: false,
    features: ["Estampado resistente", "Algodón suave", "Costuras reforzadas"],
  },
  {
    title: "Polo JavaScript",
    price: 20.0,
    description: "Deja que tu amor por JavaScript hable a través de cada hilo.",
    img_src: "/images/polo-js.png",
    category_id: 1,
    is_on_sale: false,
    features: ["Logo bordado", "Tela premium", "Varios colores disponibles"],
  },
  {
    title: "Taza JavaScript",
    price: 14.99,
    description:
      "Disfruta tu café mientras programas con el logo de JavaScript.",
    img_src: "/images/taza-js.png",
    category_id: 2,
    is_on_sale: false,
    features: ["Cerámica de alta calidad", "325ml", "Apta para microondas"],
  },
  {
    title: "Sticker React",
    price: 2.49,
    description: "Decora tus dispositivos con el icónico átomo de React.",
    img_src: "/images/sticker-react.png",
    category_id: 3,
    is_on_sale: false,
    features: ["Vinilo resistente", "No deja residuos", "Colores vibrantes"],
  },
];

const seedDatabase = async () => {
  try {
    // Seed categories
    for (const category of categories) {
      await pool.query(
        `INSERT INTO categories (title, slug, description, img_src) 
         VALUES ($1, $2, $3, $4) ON CONFLICT (slug) DO NOTHING`,
        [category.title, category.slug, category.description, category.img_src]
      );
    }

    // Seed products
    for (const product of products) {
      await pool.query(
        `INSERT INTO products (title, price, description, img_src, category_id, is_on_sale, features)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          product.title,
          product.price,
          product.description,
          product.img_src,
          product.category_id,
          product.is_on_sale,
          product.features,
        ]
      );
    }

    console.log("✅ Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
