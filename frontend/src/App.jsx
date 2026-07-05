import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";

function App() {
    return (
        <>
            <Home />

            <ToastContainer
                position="top-right"
                autoClose={2000}
            />
        </>
    );
}

export default App;