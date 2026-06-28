import type { User } from "../lib/db/schema";
import { getFeedByURL } from "../lib/db/queries/feeds";
import { createFeedFollow, getFeedFollowsForUser, deleteFeedFollow } from "../lib/db/queries/feed-follows";

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
    return;
  }

  console.log(`${user.name} is following:`);

  for (const follow of feedFollows) {
    console.log(` * ${follow.feedsName}`);
  }
}

export async function handlerUnfollow(cmdName: string, user: User, ...args: string[]) {
    const feedURL = args[0];

    if (args.length !== 1) {
        throw new Error(`Usage: ${cmdName} <FEED_URL>`);
    }
    if (feedURL) {

        const feed = await getFeedByURL(feedURL);
        if (!feed) {
            throw new Error("could not find name of the feed!");
        }

        const feedName = feed.name;

        const deletedFeedFollow = await deleteFeedFollow(feedURL, user.id);
        console.log(`${user.name} has unfollowed ${feedName}`);
    }
    
}