import { readConfig } from "../config";
import { getUserByName, getUserById } from "../lib/db/queries/users";
import { createFeed, getFeeds } from "../lib/db/queries/feeds";
import type { Feed, User } from "../lib/db/schema";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {

    if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <feed-name> <feed-url>`);
  }
    const [ name, url ] = args as [ string, string ];
    const currentUser = await getUserByName(readConfig().currentUserName);

    if (!currentUser){
        throw new Error("current user not found!");
    }

  const feed = await createFeed(name, url, currentUser?.id);

  if (!feed) {
    throw new Error("failed to create feed");
    }
  printFeed(feed, currentUser);

}

export async function handlerGetFeeds( _: string) {
  let i: number = 0;
  try {
    const feeds = await getFeeds();
    if (feeds) {
      for (const feed of feeds) {
        const user = await getUserById(feed.userId);
        console.log(`FEED #${i + 1}:`);
        console.log(` Name: ${feed.name}`);
        console.log(` URL: ${feed.url}`);
        console.log(` Created by: ${user?.name}`);
        i++;
      }
    }
  } catch(err) {
    throw new Error(`Error: ${(err as Error).message}`);
}
}

function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}