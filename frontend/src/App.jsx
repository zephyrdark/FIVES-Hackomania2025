import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import './App.css';
import Home from '../pages/Home';
import Test from "../pages/Test";
import Layout from "../components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Layout> {/* Wrap all routes inside Layout */}
        <Routes>
          <Route exact path="/recipe" element={<Home />} />
          <Route exact path="/test" element={<Test />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
