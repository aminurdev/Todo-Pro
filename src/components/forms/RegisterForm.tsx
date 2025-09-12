import { useForm } from "react-hook-form";

import { Button, Input } from "../ui";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import {
  registerSchema,
  type RegisterFormData,
} from "../../utils/schemas/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { registerUser } from "../../store/slices/authSlice";

export default function RegisterForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await dispatch(registerUser(data)).unwrap();
      if (result) {
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <h2 className="text-xl font-semibold text-center">Register</h2>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <Input
          id="name"
          type="text"
          {...register("name")}
          error={errors.name?.message}
          placeholder="Enter your name"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          error={errors.email?.message}
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          error={errors.password?.message}
          placeholder="Enter your password"
        />
      </div>
      {error && <div className="text-red-600 text-sm text-center">{error}</div>}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Registering" : "Register"}
      </Button>
    </form>
  );
}
