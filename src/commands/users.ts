import { setUser, readConfig } from "../config";
import { createUser, getUserByName, getUsers, resetDatabase } from "../lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
    const username = args[0];

    if (args.length === 0 || !username) {
        throw new Error("you should provide an username!\nlogin <username>");
    }

    const getUserResult = await getUserByName(username);
        
        if (!getUserResult) {
            throw new Error("Error: user not found!");
        }

    setUser(getUserResult.name);
    console.log("User switched successfully!"); 
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    const username = args[0];

    if (args.length === 0 || !username) {
        throw new Error("you should provide an username!\nregister <username>");
    }

    try {
        const getUserResult = await getUserByName(username);
        
        if (getUserResult) {
            throw new Error("user already exists!");
        }

        const createUserResult = await createUser(username);
        setUser(username);

        console.log("the user has been created successfully!");
        console.log(createUserResult);

    } catch (err) {
        throw new Error(`Error: ${(err as Error).message}`);
    }
}

export async function handlerReset() {
    try {
        await resetDatabase();
        console.log("users table has been reset!");
    } catch (err) {
        throw new Error(`Error: ${(err as Error).message}`);
    }
}

export async function handlerUsers() {
    try {
        const users = await getUsers(); 
        if (users) {
            for (const user of users) {
                user.name === readConfig().currentUserName ? console.log(`* ${user.name} (current)`) : console.log(`* ${user.name}`);
            }
        }
    } catch (err) {
        throw new Error(`Error: ${(err as Error).message}`);
    }
}