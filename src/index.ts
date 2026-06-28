import { 
    type CommandsRegistry,
    registerCommand,
    runCommand, 
} from "./commands/commands";
import { 
    handlerLogin,
    handlerRegister,
    handlerReset,
    handlerUsers
 } from "./commands/users";
import { handlerAggregate } from "./commands/aggregate";
import {
    handlerAddFeed, 
    handlerGetFeeds,
} from "./commands/feeds";
import {  handlerFollow, handlerFollowing } from "./commands/feed-follows";
import { middlewareLoggedIn } from "./middleware";

async function main() {
    const registry: CommandsRegistry = {};

    registerCommand(registry, "login", handlerLogin);
    registerCommand(registry, "register", handlerRegister);
    registerCommand(registry, "reset", handlerReset);
    registerCommand(registry, "users", handlerUsers);
    registerCommand(registry, "agg", handlerAggregate);
    registerCommand(registry, "feeds", handlerGetFeeds);

    registerCommand(registry, "addfeed", middlewareLoggedIn(handlerAddFeed));
    registerCommand(registry, "follow", middlewareLoggedIn(handlerFollow));
    registerCommand(registry, "following", middlewareLoggedIn(handlerFollowing));
    

    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log("no arguments were provided!");
        process.exit(1);
    }

    if (args[0]) {
        await runCommand(registry, args[0], ...args.slice(1));
        process.exit(0);
    }

}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
