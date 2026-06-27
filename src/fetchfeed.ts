import type { RSSFeed, RSSItem } from "./fetchfeed.d"
import { XMLParser } from "fast-xml-parser";

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
    const response = await fetch(feedURL, {
        method: "GET",
        mode: "cors",
        headers: {
            "User-Agent": "gator", 
        },
    });

    const parser = new XMLParser({
        processEntities: false,
    }); 
    const parsedObj = parser.parse(await response.text());

    if (!parsedObj.rss.channel) {
        throw new Error("failed to parse channel");
    }

    const { rss:

        { channel:

            { title, link, description }

            } 
               } = parsedObj;

    if (!title || !link || !description) {
        throw new Error("a field is missing in channel!");
    }

    let items: RSSItem[];

    const itemField = parsedObj.rss.channel.item;

    if (itemField) {
        if (Array.isArray(itemField)) {
            items = itemField;
        } else {
            items = [ itemField ];
        }
    } else {
        items = [];
    }

    const validatedItems: RSSItem[] = [];

    for (const item of items) {
        if (!item.title || !item.link || !item.description || !item.pubDate) {
            continue;
        }

        validatedItems.push(item);
    }

    return {
        channel: {
            title: title,
            link: link,
            description: description,
            item: validatedItems,
        }
    }

}