import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RouteMap from "./RouteMap";
import Dashboard from "./Screen/Dashboard";
import MyPage from "./Screen/MyPage";

function App() {
  return (
    <BrowserRouter>
      <RouteMap/>
    </BrowserRouter>
  );
}

export default App;
