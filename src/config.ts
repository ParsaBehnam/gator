import fs from "fs";
import os from "os";
import path from "path";

type Config = {
    dbUrl: string;
    currentUserName: string;
};

export function setUser(userName: string): void {  // writes Config obj to the JSON file
    const config = readConfig();
    config.currentUserName = userName;
    writeConfig(config);
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
   return path.join(os.homedir(), ".gatorconfig.json");
}

function writeConfig(cfg: Config): void {
    try {
        fs.writeFileSync(getConfigFilePath(), JSON.stringify({
            db_url: cfg.dbUrl,
            current_user_name: cfg.currentUserName
        }));

    } catch (err) {
        throw new Error("error writing to the file: " + err);
    }
}

function validateConfig(rawConfig: any): Config { // used by readConfig() since json.parse() returns "any"
    if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
        throw new Error("config file is missing the database url");
    }

    return {
        dbUrl: rawConfig.db_url,
        currentUserName: rawConfig.current_user_name ?? "",
    };
}