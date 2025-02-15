
// import DynamicForm from "../components/PresetQuestions"

// export default function Smart() {

//     return (
// <div className="App bg-white min-h-screen flex items-center justify-center p-4">
//     <div className="w-[430px] h-[932px] overflow-hidden">
//         <DynamicForm />
//     </div>
// </div>

// <div>

// </div>

//     )
// }
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { replyConversation, startConversation } from "../api";
import RecipeCard from "../components/RecipeCard3";

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(true);
    const [finalRecipe, setFinalRecipe] = useState(null);

    const [error, setError] = useState(false);


    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        try {
            const userMessage = { id: Date.now(), role: "user", message: input };
            setMessages([...messages, userMessage]);
            const payload = { user_input: input }

            setInput("");
            setIsTyping(true);


            const response = await replyConversation(payload)
            await new Promise(resolve => setTimeout(resolve, 1000))


            // let response3 = { "response_type": "question", "message": "Any specific proteins you like? (Question 2)" }
            // let response = { "response_type": "recipe", "recipe_json": { "recipe": { "name": "Spicy Szechuan Chicken", "servings": 2, "ingredients": [{}], "instructions": [{}], imageUrl: "https://h7.alamy.com/comp/HT5DCX/man-with-gloves-working-with-tomato-in-genetic-engineering-laboratory-HT5DCX.jpg" } } }

            const newMessage = { id: Date.now() + 1, role: "assistant", ...response }
            // const newMessage2 = { id: Date.now() + 2, role: "assistant", ...response3 }

            if (response.response_type === 'recipe') {
                //TODO: GET IMAGE HERE?
                setFinalRecipe(response.recipe_json.recipe)
            }
            setMessages((prev) => [...prev, newMessage]);
            setIsTyping(false);

            // Simulate AI response delay
            // setTimeout(() => {
            //     const aiMessage = { id: Date.getMilliseconds + 1, role: "assistant", message: "This is an AI response." };
            //     setMessages((prev) => [...prev, aiMessage]);
            //     setIsTyping(false);
            // }, 1500);
        } catch (error) {
            console.error(error)
            setError(true)
        } finally {
            setIsTyping(false)
        }

    };


    const initializeConversation = async () => {
        try {
            // await new Promise(resolve => setTimeout(resolve, 1000))
            const response = await startConversation()
            //dummy data
            // let response = { id: Date.now(), "response_type": "question", "message": "Any specific proteins you like?" }
            console.log(response, 'response')
            response.role = "assistant"
            console.log(response, 'response')
            setMessages([response])

        } catch (e) {

            console.error(e)
            setError(true)
        } finally {
            setIsTyping(false)
        }
    }

    useEffect(() => {
        console.log('running')
        initializeConversation()
    }, [])

    return (
        <div className="flex items-center justify-start">
            <Header pageName="Smart Eats"></Header>
            <div className="bg-white rounded-lg  flex flex-col mt-5">
                {/* Chat Messages */}
                <div className=" overflow-y-auto p-4">
                    {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}>

                            {message.message ?
                                <div
                                    className={`p-3 rounded-lg ${message.role === "user" ? "bg-orange-500 text-white" : " bg-gray-200"
                                        }`}
                                >
                                    {message.message}
                                </div>
                                :
                                null
                            }
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start items-center mb-4">
                            <div className="p-3 rounded-lg bg-gray-200 relative flex items-center">
                                AI is typing
                                <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin ml-3"></div>
                            </div>
                        </div>

                    )}
                </div>
                {finalRecipe ?
                    <>
                        <RecipeCard title={finalRecipe.name} prepTime={45} thumbnailUrl={finalRecipe.imageUrl} recipe={finalRecipe} />
                        <div className="w-full bg-blue-500 text-white py-3 rounded-lg text-center font-semibold hover:bg-blue-600 transition duration-300 mb-15 mt-5" onClick={async () => {
                            setMessages([])
                            setFinalRecipe(null)
                            setError(false)
                            initializeConversation()
                        }}>
                            Continue Exploring!
                        </div>
                    </>
                    : error ? <div className="w-full bg-red-500 text-white p-3 rounded-lg text-center font-semibold hover:bg-blue-600 transition duration-300 mb-15 mt-5" onClick={async () => {
                        setMessages([])
                        setFinalRecipe(null)
                        setError(false)
                        initializeConversation()
                    }}>
                        An error has occurred! Retry?
                    </div> :
                        <div className="border-t p-4">
                            <form onSubmit={handleSubmit} className="flex space-x-2">
                                <input
                                    value={input}
                                    onChange={handleInputChange}
                                    placeholder="Type your message..."
                                    className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                />
                                <button type="submit" disabled={isTyping} className="px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400">
                                    Send
                                </button>
                            </form>
                        </div>
                }
            </div>
        </div>
    );
}
