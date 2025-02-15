import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Test() {
    const [number, setNumber] = useState(10)
    const [name, setName] = useState("")
    useEffect(() => {
        setName((prev) => prev += 'abc')
    }, [number])
    let exampleArray = { test: 'abc' }
    useNavigate('/recipe')
    return (
        <div>
            Home {exampleArray.test}
            Number is : {number}

            Name: {name}
            <btn onClick={() => { setNumber((prev) => prev + 1) }}>Add one</btn>
        </div>

    )
}