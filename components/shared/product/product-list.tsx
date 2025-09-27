import { Product } from '@/db/sample-data';

interface Props {
  products: Product[];
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
            <div key={product.slug}>{product.name}</div>
          ))}
        </div>
      )}
    </div>
  );
};
