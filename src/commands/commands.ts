export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]): Promise<void> {
        const handler = registry[cmdName];

        if (!handler) {
            throw new Error(`command ${cmdName} not found in registry`);
        }

            try {
        await handler(cmdName, ...args);
    } catch (err) {
        console.log((err as Error).message);
        process.exit(1);
    }       
}


