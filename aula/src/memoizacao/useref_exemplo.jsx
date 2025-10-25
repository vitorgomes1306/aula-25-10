import { useRef } from "react"

function Cafeteria (){
    const caneca  = useRef(null)

    function servirCafe(){
        // use console.log com múltiplos argumentos (bom para depuração)
        console.log("usando a caneca: ", caneca.current?.value)

        // alert aceita apenas um argumento — passar múltiplos argumentos não concatena
        // => precisamos unir em uma string (template ou +) e também checar null safety
        const valor = caneca.current?.value ?? "(vazio)"
        alert(`usando a caneca: ${valor}`)
    }

return (

    <div>
        <h2>Cafeteria React</h2>
        <input ref={ caneca } placeholder="Minha caneca favorita" />
        <button onClick={servirCafe}>Servir café</button>
    </div>
)
}

export default Cafeteria