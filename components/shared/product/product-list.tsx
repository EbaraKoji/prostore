import { ProductSchema } from '@/types';
import { ProductCard } from './product-card';

interface Props {
  products: ProductSchema[];
  title?: string;
  limit?: number;
}

export const ProductList = ({ products, title, limit }: Props) => {
  const limitedProducts = limit ? products.slice(0, limit) : products;
  return (
    <div className="my-10">
      <h2 className="h2-bold mb-4">{title}</h2>
      {products.length === 0 ? (
        <div>
          <p>No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols1-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {limitedProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
