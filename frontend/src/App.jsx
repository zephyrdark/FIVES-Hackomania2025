import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import './App.css';
import Home from '../pages/Home';
import Layout from "../components/Layout";
import Smart from "../pages/Smart";

function App() {
  return (
    <BrowserRouter>
      <Layout> {/* Wrap all routes inside Layout */}
        <Routes>
          <Route exact path="/recipe" element={<Home />} />
          <Route exact path="/smart" element={<Smart />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
