import fs from "fs";
import os from "os";

type Config = {
    dbUrl: string;
    currentUserName: string;
};

export function setUser(cfg: Config, userName: string): void {  // writes Config obj to the JSON file
    // ...
}

export function readConfig(): Config { // reads the JSON file
    try {
        const data = fs.readFileSync(getConfigFilePath(), { encoding: "utf-8", flag: 'r'});

        return validateConfig(JSON.parse(data));

    } catch (err) {
        throw new Error("error reading the config file: " + err);
    }
}

function getConfigFilePath(): string {
   return `${os.homedir()}/.gatorconfig.json`;
}

function writeConfig(cfg: Config): void {
    // ...
}

function validateConfig(rawConfig: any): Config { // used by readConfig() since json.parse() returns "any"
    if (!rawConfig.db_url) {
        throw new Error("config file is missing the database url");
    }

    return {
        dbUrl: rawConfig.db_url,
        currentUserName: ""
    };
}