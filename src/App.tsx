import { RouterProvider } from "react-router";
import router from "./router/Router";
import { useAppDispatch } from "./hooks";
import { useEffect } from "react";
import { getUser } from "./store/slices/authSlice";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

export default App;
