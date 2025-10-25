import { memo } from "react";
import ProductItem from "./ProductItem";

function ProductListInner({ items = [], highlightId }) {
    return (
        <div>
            {items.length === 0 && <div>Não há produtos</div>}
            {items.map((product) => (
                <ProductItem
                    key={product.id}
                    product={product}
                    highlight={highlightId === product.id}
                />
            ))}
        </div>
    )
}

export default memo(ProductListInner);