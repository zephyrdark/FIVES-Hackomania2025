
import DynamicForm from "../components/PresetQuestions"

export default function Smart() {

    return (
        <div className="App bg-white min-h-screen flex items-center justify-center p-4">
            <div className="w-[430px] h-[932px] overflow-hidden">
                <DynamicForm />
            </div>
        </div>


    )
}