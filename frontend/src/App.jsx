import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import RestaurantsPage from "./pages/customer/RestaurantsPage";
import RestaurantDetailPage from "./pages/customer/RestaurantDetailPage";
import CartPage from "./pages/customer/CartPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import AuthGuard from "./components/auth/AuthGuard";
import MyOrdersPage from "./pages/customer/MyOrdersPage";
import OrderDetailPage from "./pages/customer/OrderDetailPage";
import OrderSuccessPage from "./pages/customer/OrderSuccessPage";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardHomePage from "./pages/dashboard/DashboardHomePage";
import DashboardOrdersPage from "./pages/dashboard/DashboardOrdersPage";
import RoleGuard from "./components/auth/RoleGuard";
import DashboardMenuPage from "./pages/dashboard/DashboardMenuPage";
import DashboardRestaurantPage from "./pages/dashboard/DashboardRestaurantPage";
import DashboardReviewsPage from "./pages/dashboard/DashboardReviewsPage";
import DashboardAdminsPage from "./pages/dashboard/DashboardAdminsPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./components/common/NotFoundPage";
import ErrorBoundary from "./components/common/ErrorBoundary";



export default function App() {
  return (
   <ErrorBoundary>
        <Routes>
          {/* Auth pages (no header/footer) */}
          <Route path="/auth" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />

          {/* Main app */}
         <Route element={<AppLayout />}>
         <Route index element={<HomePage />} />
  <Route path="restaurants" element={<RestaurantsPage />} />
  <Route path="restaurants/:id" element={<RestaurantDetailPage />} />
  <Route path="cart" element={<CartPage />} />
  <Route
  path="profile"
  element={
    <AuthGuard>
      <ProfilePage />
    </AuthGuard>
  }
/>

   

  <Route
  path="/dashboard"
  element={
    <RoleGuard allowedRoles={["restaurantOwner", "admin"]}>
      <DashboardLayout />
    </RoleGuard>
  }
>
  <Route index element={<DashboardHomePage />} />
  <Route path="orders" element={<DashboardOrdersPage />} />
  <Route path="menu" element={<DashboardMenuPage />} />   
  <Route path="restaurant" element={<DashboardRestaurantPage />} />
   <Route path="reviews" element={<DashboardReviewsPage />}/>
   <Route path="admins" element={<DashboardAdminsPage />} />  
  {/* other dashboard routes will be added here */}
</Route>

  {/* protected customer routes */}
  <Route
    path="checkout"
    element={
      <AuthGuard>
        <CheckoutPage />
      </AuthGuard>
    }
  />
  <Route
    path="orders"
    element={
      <AuthGuard>
        <MyOrdersPage />
      </AuthGuard>
    }
  />
  <Route
    path="orders/:id"
    element={
      <AuthGuard>
        <OrderDetailPage />
      </AuthGuard>
    }
  />
  <Route
    path="orders/:id/success"
    element={
      <AuthGuard>
        <OrderSuccessPage />
      </AuthGuard>
    }
  />
<Route path="*" element={<NotFoundPage />} />

</Route>

        </Routes>
    </ErrorBoundary>
  );
}
