import { db } from "../index"
import { feeds, feedFollows, users } from "../schema"
import { allOrUndefined, firstOrUndefined } from "./utils";
import { eq } from "drizzle-orm";

export async function createFeed(name: string, url: string, userId: string) {
    const [ result ] = await db.insert(feeds).values({ name: name, url: url, userId: userId}).returning();
    return result;
}

export async function getFeeds() {
    const result = await db.select().from(feeds);
    return allOrUndefined(result);
}

export async function getFeedByURL(url: string) {
    const [ result ] = await db.select().from(feeds).where(eq(feeds.url, url));
    return result;
}

export async function createFeedFollow(feedId: string, userId: string ) {
    const [ newFeedFollowRecord ] = await db.insert(feedFollows).values({feedId: feedId, userId: userId}).returning();

    if (!newFeedFollowRecord) {
        throw new Error("failed to create new feed follow record");
    }

    const result = await db
    .select({
        ffId: feedFollows.id,
        ffCreatedAt: feedFollows.createdAt,
        ffUpdatedAt: feedFollows.updatedAt,
        feedsName: feeds.name,
        userName: users.name,
    })
    .from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.id ,newFeedFollowRecord.id));

    return firstOrUndefined(result);
}

export async function getFeedFollowsForUser(userId: string) {
    const result = await db.select({
        feedsName: feeds.name,
        userName: users.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.userId, userId));
    
    return allOrUndefined(result);
}