import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ApiDocsPage from "./pages/ApiDocsPage";
import NotFoundPage from "./pages/NotFoundPage";
import PostsPage from "./pages/PostsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: null,
  },
  {
    path: "/guide",
    element: <ApiDocsPage />,
  },
  {
    path: "/posts/new",
    element: <PostsPage />,
  },
  {
    path: "/posts",
    element: <PostsPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
