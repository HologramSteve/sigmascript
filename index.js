function extractContentBetween(str, startChar, endChar) {
    const results = [];
    let start = str.indexOf(startChar);

    while (start !== -1) {
        const end = str.indexOf(endChar, start);
        if (end !== -1) {
            results.push(str.slice(start + 1, end));
            start = str.indexOf(startChar, end);
        } else {
            break;
        }
    }

    return results;
}






const fs = require("fs")
const path = require("path")

const p = path.join(__dirname, "/project/sprites/Sprite1/sprite.ss")
const rawcode = fs.readFileSync(p, "utf8")

let lines = rawcode.split("\r\n")
lines = lines.map(line => line.trim())
lines = lines.filter(line => line !== '')


let codesnippet = {blocks: []}

for (const line of lines) {
    if (line.endsWith("{")) {
        codesnippet["event"] = extractContentBetween(line, "(", ")")[0]

        continue
    }

    if (line === "}") {
        console.log(codesnippet)

        codesnippet = {blocks: []}

        continue;
    }

    let lineparts = line.split(".")
    const func_catagory = lineparts[0]
    const func_name = lineparts.join().split("(")[0].split(",")[1]

    const rawarguments = line.slice(line.indexOf("(") + 1, line.lastIndexOf(")"))
    const arguments = rawarguments.split(", ")


    codesnippet.blocks.push({category: func_catagory, name: func_name, arguments: arguments})
}