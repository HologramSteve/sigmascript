let data = require("./sprite.json")
data = data.blocks


let blocks = []

for (const blockkey in data) {
    const blockdata = data[blockkey]


    let exportdata = {opcode: blockdata.opcode}

    if (blockdata.inputs) {
        exportdata["inputs"] = Object.keys(blockdata.inputs)
    }
    if (blockdata.fields) {
        exportdata["fields"] = Object.keys(blockdata.fields)
    }


    blocks.push(exportdata)




}

console.log(blocks)

const fs = require("fs")
const path  = require("path")
fs.writeFileSync(path.join(__dirname, "../blocks.json"), JSON.stringify(blocks, null, 2))
fs.writeFileSync(path.join(__dirname, "blocks.json"), JSON.stringify(blocks, null, 2))