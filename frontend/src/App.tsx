import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ApiDocsPage from "./pages/ApiDocsPage";
import NotFoundPage from "./pages/NotFoundPage";
import PostCreatePage from "./pages/PostCreatePage";
import PostDetailPage from "./pages/PostDetailPage";
import PostListPage from "./pages/PostListPage";

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
    element: <PostCreatePage />,
  },
  {
    path: "/posts",
    element: <PostListPage />,
  },
  {
    path: "/posts/:postId",
    element: <PostDetailPage />,
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
