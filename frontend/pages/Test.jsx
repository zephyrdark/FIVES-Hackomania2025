import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import DynamicForm from "../components/PresetQuestions"

export default function Test() {
    const [number, setNumber] = useState(10)
    const [name, setName] = useState("")
    useEffect(() => {
        setName((prev) => prev += 'abc')
    }, [number])
    let exampleArray = { test: 'abc' }
    useNavigate('/recipe')
    return (
        <div className="App bg-white min-h-screen flex items-center justify-center p-4">
        <div className="w-[430px] h-[932px] overflow-hidden">
            <DynamicForm />
        </div>
      </div>
        

    )
}