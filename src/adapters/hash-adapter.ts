import bcrypt from "bcrypt";

export const HashAdapter = {
    async passwordHash(password: string, passwordSalt: string): Promise<string> {
        return await bcrypt.hash(password, passwordSalt)
    },
}