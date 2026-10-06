import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddTransaction from "./pages/AddTransaction";
import Accounts from "./pages/Accounts";
import Transactions from "./pages/Transactions";
import EditTransaction from "./pages/EditTransaction";
import ProtectedRoute from "./components/ProtectedRoute";
import Budgets from "./pages/Budgets";
import SavingsGoals from "./pages/SavingsGoals";
import Categories from "./pages/Categories";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-transaction" element={<AddTransaction />}/>
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/savings-goals" element={<SavingsGoals />}/>
        <Route path="/edit-transaction/:id" element={<EditTransaction />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;