import type { Role } from "@/lib/db/schema";

export type JwtPayload = {
	id: string;
	email: string;
	username: string;
	role: Role;
};
