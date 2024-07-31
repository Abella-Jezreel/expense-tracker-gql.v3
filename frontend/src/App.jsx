import { Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/ui/Header";
import HomePage from "./components/pages/HomePage";
import LoginPage from "./components/pages/LoginPage";
import SignUpPage from "./components/pages/SignUpPage";
import TransactionPage from "./components/pages/TransactionPage";
import NotFound from "./components/pages/NotFound";
import { useQuery } from "@apollo/client";
import GET_USER from "./graphql/queries/user.query";
import { Toaster } from "react-hot-toast";
import Cookies from 'js-cookie';

function App() {
  const { data, loading, error } = useQuery(GET_USER);
  const user = data?.authUser;
  const sessionCookie = Cookies.get('connect.sid');

  console.log(user, 'user');
  console.log(sessionCookie, 'sessionCookie');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div className="w-full bg-black text-white bg-grid-white/[0.2] relative">
        <div className="absolute pointer-events-none inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        {user && <Header />}
        <Routes>
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={<SignUpPage />}
          />
          <Route
            path="/transaction/:id"
            element={user ? <TransactionPage /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </>
  );
}

export default App;
