import { fetchFeed } from "../fetchfeed";

export async function handlerAggregate(cmdName: string, ...args: string[]) {
    const feedObj = await fetchFeed("https://www.wagslane.dev/index.xml");
    console.log(JSON.stringify(feedObj, null, 2));
}