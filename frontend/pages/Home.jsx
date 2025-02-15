
import { Search } from "lucide-react";
import Header from "../components/Header"; // Import the Header component

export default function Home() {
    return (
        <div className="px-3">
            <div className="min-h-screen bg-gray-100">
                <Header pageName={"Explore Recipes"} >
                </Header>
                <div className="mt-10 flex items-center gap-3">
                    {/* Search Bar */}
                    <div className="flex items-center bg-gray-200 px-3 py-2 rounded-full w-full">
                        <Search size={18} className="text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search Recipe"
                            className="ml-2 bg-transparent outline-none w-full text-gray-700 placeholder-gray-500"
                        />
                    </div>

                    {/* SMARTEATS Button */}
                    <btn className="bg-blue-500 px-4 py-2 rounded-partial text-white font-medium">
                        SMARTEATS
                    </btn>

                </div>
                <div className="pt-2 px-4">
                    <p className="text-2xl font-bold">Top Recipes</p>
                </div>

            </div>

        </div>
    );
}
