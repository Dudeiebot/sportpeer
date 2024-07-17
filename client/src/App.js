import { Home } from "./pages/home/Home.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/layout/layout.jsx";
import { Login } from "./pages/login/Login.jsx";
import { Register } from "./pages/register/Register.jsx";
import { Profile } from "./pages/profile/Profile.jsx";
import { Settings } from "./pages/settings/Settings.jsx";
import { Verify } from "./pages/verify/Verify.jsx";
import { RequireAuth } from "./components/layout/layout.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/login",
          element: <Login />,
        },

        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/settings",
          element: <Settings />,
        },
      ],
    },
    {
      path: "/",
      element: <RequireAuth />,
      children: [
        {
          path: "/profile",
          element: <Profile />,
          // the loader here is going to connect ot each user id
        },
        {
          path: "/settings",
          element: <Settings />,
        },

        {
          path: "/register/verify",
          element: <Verify />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
