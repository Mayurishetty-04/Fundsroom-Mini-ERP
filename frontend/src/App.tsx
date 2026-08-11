import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Customers from "./pages/Customers";
import AddCustomer from "./pages/AddCustomer";
import EditCustomer from "./pages/EditCustomer";
import CustomerDetails from "./pages/CustomerDetails";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import StockMovements from "./pages/StockMovements";

import Challans from "./pages/Challans";
import AddChallan from "./pages/AddChallan";
import ChallanDetails from "./pages/ChallanDetails";

import Dashboard from "./pages/Dashboard";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Protected Application Routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Customers */}
          <Route
  path="/customers"
  element={
    <RoleProtectedRoute
      allowedRoles={["ADMIN", "SALES"]}
    >
      <Customers />
    </RoleProtectedRoute>
  }
/>

<Route
  path="/customers/add"
  element={
    <RoleProtectedRoute
      allowedRoles={["ADMIN", "SALES"]}
    >
      <AddCustomer />
    </RoleProtectedRoute>
  }
/>

<Route
  path="/customers/:id"
  element={
    <RoleProtectedRoute
      allowedRoles={["ADMIN", "SALES"]}
    >
      <CustomerDetails />
    </RoleProtectedRoute>
  }
/>

<Route
  path="/customers/:id/edit"
  element={
    <RoleProtectedRoute
      allowedRoles={["ADMIN", "SALES"]}
    >
      <EditCustomer />
    </RoleProtectedRoute>
  }
/>

          {/* Products */}
         <Route
  path="/products"
  element={
    <RoleProtectedRoute
      allowedRoles={[
        "ADMIN",
        "SALES",
        "WAREHOUSE",
      ]}
    >
      <Products />
    </RoleProtectedRoute>
  }
/>

<Route
  path="/products/add"
  element={
    <RoleProtectedRoute
      allowedRoles={["ADMIN", "WAREHOUSE"]}
    >
      <AddProduct />
    </RoleProtectedRoute>
  }
/>

<Route
  path="/products/:id/edit"
  element={
    <RoleProtectedRoute
      allowedRoles={["ADMIN", "WAREHOUSE"]}
    >
      <EditProduct />
    </RoleProtectedRoute>
  }
/>

          {/* Inventory */}
          <Route
  path="/stock-movements"
  element={
    <RoleProtectedRoute
      allowedRoles={[
        "ADMIN",
        "WAREHOUSE",
      ]}
    >
      <StockMovements />
    </RoleProtectedRoute>
  }
/>

          {/* Challans */}
          <Route
  path="/challans"
  element={
    <RoleProtectedRoute
      allowedRoles={[
        "ADMIN",
        "SALES",
        "ACCOUNTS",
      ]}
    >
      <Challans />
    </RoleProtectedRoute>
  }
/>

<Route
  path="/challans/add"
  element={
    <RoleProtectedRoute
      allowedRoles={["ADMIN", "SALES"]}
    >
      <AddChallan />
    </RoleProtectedRoute>
  }
/>

<Route
  path="/challans/:id"
  element={
    <RoleProtectedRoute
      allowedRoles={[
        "ADMIN",
        "SALES",
        "ACCOUNTS",
      ]}
    >
      <ChallanDetails />
    </RoleProtectedRoute>
  }
/>
        </Route>

        {/* Default */}
        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        {/* Unknown URL */}
        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;