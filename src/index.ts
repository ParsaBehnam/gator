import { readConfig, setUser } from "./config";

function main() {
    setUser("Maryam");
    console.log(readConfig());
}

main();
