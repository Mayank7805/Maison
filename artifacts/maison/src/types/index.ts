export type Role = "USER" | "ADMIN";

export interface User {
  id: string;
  name?: string | null;
  email: string;
  role: Role;
}
