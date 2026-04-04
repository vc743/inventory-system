import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "@/application/layouts/Layout";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                {/* Routes */}
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router;