import { RouterProvider } from "react-router";
import router from "./router/Router";
import { useAppDispatch } from "./hooks";
import { useEffect } from "react";
import { getUser } from "./store/slices/authSlice";
import { Toaster } from "@/components/ui/sonner";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" richColors />
    </>
  );
}

export default App;
