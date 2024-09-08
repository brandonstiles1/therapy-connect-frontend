import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/LoginPage";
import Welcome from "./components/Welcome";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/confirm" element={<Welcome />} />
      </Routes>
    </BrowserRouter>
  );
}
