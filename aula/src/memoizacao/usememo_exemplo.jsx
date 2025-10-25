import { useMemo, useState } from "react";

function CafeteriaMemo() {

    const [tipoCafe, setTipoCafe] = useState("Capuccino")

    const receita = useMemo(() => {
        console.log("Preparando a receita...")
        return tipoCafe === "Capuccino"
            ? "Leite vaporizado + expresso + canela"
            : "Apenas expresso puro"
    }, [tipoCafe])

    return (
        <div>
            <h2>
                Cafeteria Recat Memo
            </h2>
            <h3>Memoizando seus desejos</h3>
            <p>Receita atual: {receita}</p>

            <button onClick={() => setTipoCafe("Expresso")}>Pedir Expresso</button>
            <button onClick={() => setTipoCafe("Capuccino")}>Pedir Capuccino</button>
        </div>
    )

}

export default CafeteriaMemo