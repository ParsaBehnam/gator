import { setUser } from "../config";
import { createUser, getUser, resetDatabase } from "../lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
    const username = args[0];

    if (args.length === 0 || !username) {
        throw new Error("you should provide an username!\nlogin <username>");
    }

    const getUserResult = await getUser(username);
        
        if (!getUserResult) {
            throw new Error("Error: user not found!");
        }

    setUser(username);
    console.log("the user has been set successfully!"); 
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    const username = args[0];

    if (args.length === 0 || !username) {
        throw new Error("you should provide an username!\nregister <username>");
    }

    try {
        const getUserResult = await getUser(username);
        
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