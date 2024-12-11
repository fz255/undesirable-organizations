let { parse } = require("node-html-parser")
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const https = require('https');
const agent = new https.Agent({
	rejectUnauthorized: false,
});
const fs = require('fs');

let body = await fetch(`https://minjust.gov.ru/ru/documents/7756/`, {
    agent: agent
})
body = await body.text()
let parsed = parse(body)
let output = []

for(var i of parsed.querySelector("tbody").querySelectorAll("tr")) {
    let obj = {
        id: i.querySelectorAll("td")[0].textContent,
        fullName: i.querySelectorAll("td")[3].textContent,
        decisionInMinjust: i.querySelectorAll("td")[1].textContent,
        decisionInGenproc: i.querySelectorAll("td")[2].textContent,
        decisionOutMinjust: i.querySelectorAll("td")[4].textContent,
        decisionOutGenproc: i.querySelectorAll("td")[5].textContent,
        dateIn: (i.querySelectorAll("td")[1].textContent.match(/\d{2}\.\d{2}\.\d{4}/gm) != null ? i.querySelectorAll("td")[1].textContent.match(/\d{2}\.\d{2}\.\d{4}/gm)[0] : ""),
        dateOut: (i.querySelectorAll("td")[4].textContent.match(/\d{2}\.\d{2}\.\d{4}/gm) != null ? i.querySelectorAll("td")[4].textContent.match(/\d{2}\.\d{2}\.\d{4}/gm)[0] : "")
    }
    output.push(obj)
}

fs.writeFileSync("./registry.json", JSON.stringify(output))
console.log("Successful update")