import fs from "fs";
function main() {
    fs.readFile("/home/parsa/.gatorconfig.json", "utf-8", (err, data) => {
            if (err) {
                console.log(`error reading file: ${err}`);
                return;
            }
            console.log(JSON.parse(data));
        });
}

main();
