import { readConfig } from "../config";
import { getUser } from "../lib/db/queries/users";
import { createFeed } from "../lib/db/queries/feeds";
import type { Feed, User } from "../lib/db/schema";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {

    if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <feed-name> <feed-url>`);
  }
    const [ name, url ] = args as [ string, string ];
    const currentUser = await getUser(readConfig().currentUserName);

    if (!currentUser){
        throw new Error("current user not found!");
    }

  const feed = await createFeed(name, url, currentUser?.id);

  if (!feed) {
    throw new Error("failed to create feed");
    }
  printFeed(feed, currentUser);

}

function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}