import type { RSSFeed, RSSItem } from "./fetchfeed.d"
import { XMLParser } from "fast-xml-parser";

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
    const response = await fetch(feedURL, {
        headers: {
        "User-Agent": "gator",
        accept: "application/rss+xml",
        },
    });

    if (!response.ok) {
        throw new Error(`failed to fetch feed: ${response.status} ${response.statusText}`);
    }

    const xml = await response.text();
    const parser = new XMLParser({
        processEntities: false
    });

    const result = parser.parse(xml); 
    console.log(result);
    const channel = result.rss?.channel;
    

    if (!channel) {
        throw new Error("failed to parse channel");
    }

    if (
    !channel ||
    !channel.title ||
    !channel.link ||
    !channel.item
  ) {
    throw new Error("failed to parse channel");
  }

    const items: any[] = Array.isArray(channel.item)
    ? channel.item
    : [channel.item];

    const rssItems: RSSItem[] = [];

    for (const item of items) {
        if (!item.title || !item.link || !item.pubDate) {
            continue;
        }

           rssItems.push({
                title: item.title,
                link: item.link,
                description: item.description,
                pubDate: item.pubDate,
            });
        }

        const rss: RSSFeed = {
            channel: {
            title: channel.title,
            link: channel.link,
            description: channel.description,
            item: rssItems,
            },
        };

        return rss;
    }