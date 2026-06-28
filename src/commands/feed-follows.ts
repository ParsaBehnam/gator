import type { User } from "../lib/db/schema";
import { getFeedByURL } from "../lib/db/queries/feeds";
import { createFeedFollow, getFeedFollowsForUser } from "../lib/db/queries/feed-follows";

export async function handlerFollow(cmdName: string, user: User,...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <FEED_URL>`);
  }
  const feedUrl = args[0];
  
  if (!feedUrl) {
    throw new Error("could not get feed's URL!");
  }
    const feed = await getFeedByURL(feedUrl);

    if (feed) {
    const feedFollowRecord = await createFeedFollow(feed.id, user.id);
    console.log(`${feedFollowRecord?.userName} is now following ${feedFollowRecord?.feedsName}!`);
  }
} 

export async function handlerFollowing(cmdName: string, user: User, ...args: string[]) {
  const feedFollows = await getFeedFollowsForUser(user.id);

  if (!feedFollows) {
    throw new Error(`could not retrieve followed feeds info!`);
  }

  console.log(`${user.name} is following:`);

  for (const follow of feedFollows) {
    console.log(` * ${follow.feedsName}`);
  }
}