import { readConfig } from "../config";
import { getUserByName, getUserById } from "../lib/db/queries/users";
import { createFeed, getFeedByURL, getFeeds, createFeedFollow, getFeedFollowsForUser } from "../lib/db/queries/feeds";
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

  const feed = await createFeed(name, url, currentUser.id);

    if (!feed) {
      throw new Error("failed to create feed");
    }

    const feedFollow = await createFeedFollow(feed.id, currentUser.id);

    if(!feedFollow) {
      throw new Error("could not fetch feed_follow info!");
    }

    console.log(`${feedFollow.userName} is now following ${feedFollow.feedsName}!\n`);
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

export async function handlerFollow(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <FEED_URL>`);
  }
  const feedUrl = args[0];
  
  if (!feedUrl) {
    throw new Error("could not get feed's URL!");
  }

    const currentUser = await getUserByName(readConfig().currentUserName);
    const feed = await getFeedByURL(feedUrl);

    if (currentUser && feed) {
    const feedFollowRecord = await createFeedFollow(feed.id,currentUser?.id);
    console.log(`${currentUser.name} is now following ${feed.name}!`);
  }
} 

export async function handlerFollowing(_: string) {
  const currentUser = await getUserByName(readConfig().currentUserName);

  if (!currentUser) {
    throw new Error("could not retrieve current user info!");
  }

  const feedFollows = await getFeedFollowsForUser(currentUser.id);

  if (!feedFollows) {
    throw new Error(`could not retrieve followed feeds info!`);
  }

  console.log(`${currentUser.name} is following:`);

  for (const follow of feedFollows) {
    console.log(` * ${follow.feedsName}`);
  }
}