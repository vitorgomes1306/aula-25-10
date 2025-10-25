const categories = ["Grãos", "Maquinas", "Xicaras", "Insumos", "Bebidas"]
const randomForm = (arr) => arr[Math.floor(Math.random() * arr.length)]

function makeProduct(id) {
    const category = randomForm(categories)
    const price = +(Math.random() * 80 + 5).toFixed(2)
    const stock = Math.floor(Math.random() * 120)

    return {
        id: `SKU-${1000 + id}`,
        name: `${category} Item ${id}`,
        category,
        price,
        stock,
        soldlastMonth: Math.floor(Math.random() * 200)
    }
}

export const products = Array.from({ length: 300 }, (_, i) => makeProduct(i + 1))