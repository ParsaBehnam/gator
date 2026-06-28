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
