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
function generateBlockId() {
    const crypto = require('crypto');

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let result = '';
    for (let i = 0; i < 20; i++) {
        const randomIndex = crypto.randomInt(0, characters.length);
        result += characters[randomIndex];
    }
    return result;
}

const fs = require("fs")
const path = require("path")


function parseRawCode(rawcode) {
    let lines = rawcode.split("\r\n")
    lines = lines.map(line => line.trim())
    lines = lines.filter(line => line !== '')


    let codesnippet = {blocks: []}
    let code = []

    for (const line of lines) {
        if (line.endsWith("{")) {
            codesnippet["event"] = extractContentBetween(line, "(", ")")[0]

            continue
        }

        if (line === "}") {
            code.push(codesnippet)

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

    return code
}

const p = path.join(__dirname, "/project/sprites/Sprite1/sprite.ss")
const rawcode = fs.readFileSync(p, "utf8")

const parsed = parseRawCode(rawcode)
console.log(parsed[0])
function compileJsonBlocks(parsed) {
    let blocks = {}

    for (const codeblock of parsed) {
        const eventblockid = generateBlockId()
        blocks[eventblockid] = {opcode: "event_" + codeblock.event, next: "to-be-set", parent: null, inputs: {}, fields: {}, shadow: false, topLevel: false, x: -887, y: -875}

        for (const block of codeblock.blocks) {
            const blockid = generateBlockId()
            const opcode = block.category + "_" + block.name

            const parent = Object.keys(blocks)[ Object.keys(blocks).length - 1]

            blocks[blockid] = {opcode: opcode, next: "to-be-set", parent: parent, inputs: {}, fields: {}, shadow: false, topLevel: true}
        }
    }
}

compileJsonBlocks(parsed)