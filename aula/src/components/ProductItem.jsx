import { useRef, useEffect } from "react"

export default function ProductItem({ product, highlight }) {
    const itemRef = useRef(null)

    useEffect(() => {
        if (highlight && itemRef.current) {
            itemRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
            const t = setTimeout(() => {
                itemRef.current && itemRef.current.classList.remove("highlight"), 900
            })
            return () => clearTimeout(t)
        }
    }, [highlight])

    return (
        <div>
            <div>
                <strong>{product.name}</strong>
                <div>{product.category} - {product.id}</div>
            </div>
            <div>
                <div>R$ {product.price}</div>
                <div>Em estoque: {product.stock}</div>
            </div>
        </div>
    )
}