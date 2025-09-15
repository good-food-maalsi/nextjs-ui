import api from "@/lib/config/api.config";
import { userSchema, usersSchema } from "@/lib/schemas/user.schema";
import type { User } from "@/lib/types/user.types";

interface IUserService {
  findAll: () => Promise<User[]>;
  updateUsername: (id: string, username: string) => Promise<User>;
  updateEmail: (id: string, email: string) => Promise<User>;
  updateRole: (id: string, role: string) => Promise<User>;
  updatePassword: (
    id: string,
    currentPassword: string,
    newPassword: string
  ) => Promise<User>;
  delete: (id: string) => Promise<void>;
  deleteMany: (targetUserIds: string[]) => Promise<void>;
  deleteYourself: (id: string) => Promise<void>;
  updateUserPicture: ({
    file,
    id,
  }: {
    file: File;
    id: string;
  }) => Promise<User>;
}

const baseURL = "/user";

export const userService: IUserService = {
  async findAll() {
    const { data } = await api.get(`${baseURL}`);

    const users = usersSchema.parse(data);

    return users;
  },

  async updateUsername(id: string, username: string) {
    const { data } = await api.patch(`${baseURL}/${id}/username`, { username });

    const user = userSchema.parse(data);

    return user;
  },

  async updateEmail(id: string, email: string) {
    const { data } = await api.patch(`${baseURL}/${id}/email`, { email });

    const user = userSchema.parse(data);

    return user;
  },

  async updateRole(id: string, role: string) {
    const { data } = await api.patch(`${baseURL}/${id}/role`, { role });

    const user = userSchema.parse(data);

    return user;
  },

  async updatePassword(
    id: string,
    currentPassword: string,
    newPassword: string
  ) {
    const { data } = await api.patch(`${baseURL}/${id}/password`, {
      currentPassword,
      newPassword,
    });

    const user = userSchema.parse(data);

    return user;
  },

  async delete(id: string) {
    await api.delete(`${baseURL}/${id}`);
  },

  async deleteMany(targetUserIds: string[]) {
    await api.delete(`${baseURL}`, {
      data: { targetUserIds },
    });
  },

  async deleteYourself(id: string) {
    await api.delete(`${baseURL}/${id}/yourself`);
  },

  async updateUserPicture({ file, id }: { file: File; id: string }) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", id);

    const res = await api.patch(`${baseURL}/${id}/update-picture`, formData);
    return res.data.user;
  },
};
