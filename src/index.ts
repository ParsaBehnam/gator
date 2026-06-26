import { 
    type CommandsRegistry,
    registerCommand,
    runCommand, 
} from "./commands/commands";
import { handlerLogin } from "./commands/users";

function main() {
    const registry: CommandsRegistry = {};
    registerCommand(registry, "login", handlerLogin);
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log("no arguments were provided!");
        process.exit(1);
    }

    if (args[0]) {
    runCommand(registry, args[0], ...args.slice(1));
    }
}

main();
