import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from "./components/pages/home.tsx";
import Message from "./components/pages/Message";
import Messages from "./components/pages/Messages";
import Err from "./components/layout/err.tsx";

const fetchSummary = async () => {
    return await fetch(`${import.meta.env.VITE_API_URL}/tracker/bmc/summary`)
}

const router = createBrowserRouter([
    {
        path: "/",
        Component: Home,
        loader: fetchSummary,
        errorElement: <Err/>
    },
    {
        path: "/message/:id",
        Component: Message,
        loader: async function fetchMessage({params}) {
            return fetch(`${import.meta.env.VITE_API_URL}/tracker/bmc/status/${params["id"]}?task=status`)
        },
        errorElement: <Err/>
    },
    {
        path: "/message/:network/:nsn",
        Component: Message,
        loader: async function fetchMessage({params}) {
            return fetch(`${import.meta.env.VITE_API_URL}/tracker/bmc/search?query[src]=${params["network"]}&query[nsn]=${params["nsn"]}`)
        },
        errorElement: <Err/>
    },
    {
        path: "messages",
        Component: Messages,
        loader: fetchSummary,
        errorElement: <Err/>
    }
]);

export default function App() {
    return <RouterProvider router={router}/>
}