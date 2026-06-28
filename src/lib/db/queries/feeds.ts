import { db } from "../index"
import { feeds } from "../schema"
import { allOrUndefined } from "./utils";

export async function createFeed(name: string, url: string, userId: string) {
    const [ result ] = await db.insert(feeds).values({ name: name, url: url, userId: userId}).returning();
    return result;
}

export async function getFeeds() {
    const result = await db.select().from(feeds);
    return allOrUndefined(result);
}