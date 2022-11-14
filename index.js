const WebSocket = require('ws');
connections = new Array();
const ws = new WebSocket.Server({ port: 69, host: 'localhost'});
const url = "https://discord.com/api/webhooks/991777903945715743/tdISwIfeyREg0NUEj9hRtUR3yh2mlsvmgbIjGWnlO9Oo3lbiIo_-Ef7t-y54NqNEVUcN"
const axios = require('axios')


const rspys = {
    "hydroxide": "https://pastebin.com/raw/RZqEs6fY",
    "frosthook": "https://pastebin.com/raw/Kcq0TLVT", 
    "turtlespy": "https://pastebin.com/raw/BDhSQqUU",
    "r2s": "https://pastebin.com/raw/qEvV6JZt"
}

const hub = {
    "rspy":rspys,
}
ws.on("connection",ws =>{
    connections.push(ws);
    console.log("New connection");
    ws.on("close",()    =>{
        let index = connections.indexOf(ws);
        if (index > -1) {
            connections.splice(index, 1);
        }
        console.log("Connection closed");
    })
    ws.on("message",message =>{
        let msg = JSON.parse(message);
        if (msg.length == 2){
            if (msg[1] != "discord") {
                let json = JSON.stringify({ content: `\`\`[${msg[0]}]: ${msg[1]}\`\`` });
                var config = {
                    method: "POST",
                    url: url,
                    headers: { "Content-Type": "application/json" },
                    data: json,
                };
                axios(config).catch((err) => {
                    console.error(err);
                });
                connections.forEach(function each(client) { 
                    if (client.readyState === WebSocket.OPEN) { 
                        client.send(`[${msg[0]}]: ${msg[1]}`); 
                        console.log(`[${msg[0]}]: ${msg[1]}`);
                    }
                });
            }
            else {
                connections.forEach(function each(client) { 
                    if (client.readyState === WebSocket.OPEN) { 
                        client.send(`${msg[0]}`); 
                        console.log(`${msg[0]}`);
                    }
                });
            }
        }
        else if (msg.length == 3){
            try {
 
                if (ws.readyState === WebSocket.OPEN) { 
                    ws.send(`${hub[msg[1]][msg[2]]}`); 
                    console.log(`loaded: ${hub[msg[1]][msg[2]]}`);
                }

            } catch (e) {
                console.log(e);
                console.log(msg);
            }

        }
        else {
            let x = {
                'gameid' : msg[0],
                'jobid': msg[1],
                'playername': msg[2],
                'placename': msg[3],
            }

            connections.forEach(function each(client) { 
                if (client.readyState === WebSocket.OPEN) { 
                    client.send(JSON.stringify(x)); 
                    console.log(`invite sent!`);
                }
            });
        }
    })
})
