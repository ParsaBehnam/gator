import type { User } from "./lib/db/schema";
import type { CommandHandler } from "./commands/commands";
import { getUserByName } from "./lib/db/queries/users";
import { readConfig } from "./config";

export type UserHandlerCommand = (
    cmdName: string,
    user: User,
    ...args: string[]
) => Promise<void>;

export function middlewareLoggedIn(handler: UserHandlerCommand): CommandHandler {
    return async (cmdName: string, ...args: string[]): Promise<void> => {
        const currentUser = readConfig().currentUserName; 

        if (!currentUser) {
            throw new Error("invalid username!");
        }

        const user = await getUserByName(currentUser);

        if(!user) {
            throw new Error("could not retrieve user's info!");
        }
        
        await handler(cmdName, user, ...args);
    };
}