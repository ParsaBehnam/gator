import { setUser } from "../config";

export function handlerLogin(cmdName: string, ...args: string[]) {
    const username = args[0];
    
    if (args.length === 0 || !username) {
        throw new Error("you should provide an username!\nlogin <username>");
    }

    setUser(username);
    console.log("the user has been set successfully!"); 
}