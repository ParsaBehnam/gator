import { fetchFeed } from "../fetchfeed";
import { getNextFeedToFetch, markFeedFetched } from "../lib/db/queries/feeds";
import type { Feed } from "../lib/db/schema";

export async function handlerAggregate(cmdName: string, ...args: string[]) {
    if (args.length !== 1 ) {
        throw new Error(`Usage: ${cmdName} <TIME_BETWEEN_REQUESTS>`);
    }

    const timeBetweenReqs = args[0];

    if (!timeBetweenReqs) {
        return;
    }

    const duration = parseDuration(timeBetweenReqs);

    console.log(`Collecting feeds every ${timeBetweenReqs}`);

    scrapeFeeds().catch(handleError);

    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, duration);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });

}

async function scrapeFeeds() {
  const feed = await getNextFeedToFetch();
  if (!feed) {
    console.log(`No feeds to fetch.`);
    return;
  }
  console.log(`Found a feed to fetch!`);
  await scrapeFeed(feed);
}

async function scrapeFeed(feed: Feed) {
  const feedData = await fetchFeed(feed.url);

  await markFeedFetched(feed.id);

  for (const item of feedData.channel.item) {
    console.log(`TITLE: ${item.title}`);
  }

  console.log(
    `Feed ${feed.name} collected, ${feedData.channel.item.length} posts found`,
  );
}

function parseDuration(durationStr: string): number {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);

    if (!match) {
        throw new Error("invalid duration");
    }

    const duration = match[1];
    const unit = match[2];

    switch (unit) {
        case "ms":
            return Number(duration);
        case "s":
            return Number(duration) * 1000;
        case "m":
            return Number(duration) * 60 * 1000;
        case "h" :
            return Number(duration) * 60 * 60 * 1000;
        default:
            throw new Error("error parsing the duration between requests!");
    }
}

function handleError(err: unknown): void {
    if (err instanceof Error) {
        console.log(`${err.name}: ${err.message}`);
    } else {
        console.log(`unknown err: ` + err);
    }
}