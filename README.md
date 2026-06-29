# gator

A CLI RSS aggregator built in TypeScript. Part of [Boot.dev's](https://www.boot.dev/) backend developer path. (WORK IN PROGRESS!)

## Requirements

- Bun
- PostgreSQL

## Installation

Clone the repository, then install dependencies with:

```bash
bun install
```
## Configuration

Create a JSON config file for gator in your home directory (~/.gatorconfig.json) and include your PostgreSQL connection string.

Example:
```
{
  "db_url": "postgres://username:password@localhost:5432/gator"
}
```
Make sure your PostgreSQL database exists before running commands.

## Running the CLI 

Run commands with:

```bash
bun run start <command> [arg1] [arg2]
```

## Commands

* Register a user:

```bash
bun run start register jane
```

* Log in as a user:

```bash
bun run start login jane
```

* Add a feed: 

args : [feed_name], [feed_URL]

```bash
bun run start addfeed "xkcd" "https://xkcd.com/rss.xml"
```

* List all feeds:

```bash
bun run start feeds
```

* Follow a feed:

arg: [feed_URL]

```bash
bun run start follow "https://xkcd.com/rss.xml"
```

* View followed feeds:

```bash
bun run start following
```

* Start the aggregator:

arg: [time_between_requests]

```bash
bun run start agg 1m
```
NOTE: You have to let the "agg" command run in the background while interacting with other commands

* Browse Posts:

optional arg: [post_retrieval_limit]

```bash
bun run start browse 10
```