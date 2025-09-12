import { baseApi } from "./baseApi";
import type { UserProfile } from "../../types/user";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfile, string>({
      query: (userId) => `/users/${userId}/profile`,
      providesTags: (result, error, userId) => [
        { type: "Profile", id: userId },
      ],
    }),
    updateProfile: builder.mutation<
      UserProfile,
      { userId: string; profile: Partial<UserProfile> }
    >({
      query: ({ userId, profile }) => ({
        url: `/users/${userId}/profile`,
        method: "PUT",
        body: profile,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "Profile", id: userId },
      ],
    }),
    getUsers: builder.query<UserProfile[], { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: "/users",
        params: { page, limit },
      }),
      providesTags: ["User"],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
} = userApi;
