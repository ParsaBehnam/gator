import { eq } from "drizzle-orm";
import { db } from "..";
import { feeds, feedFollows, users } from "../schema";
import { firstOrUndefined, allOrUndefined } from "./utils";

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