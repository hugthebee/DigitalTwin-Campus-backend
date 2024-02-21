const axios = require('axios');
const express = require('express');
const router = express.Router();
const cors = require('cors');

const _url = "http://onem2m.iiit.ac.in:443/~/in-cse/in-name/";
const _ae = "AE-WM/";
const _cnt = "WM-WF/";
const _desc = "/Descriptor/la/";
const _data = "/Data/la/"
const headers = {
    "X-M2M-Origin": "iiith_guest:iiith_guest",
    "Content-Type": "application/json"
};

const convert = require('xml-js');
const options = {
    compact: true,
    ignoreComment: true,
    spaces: 4
};

nodes = ["WM-WF-PH01-00", "WM-WF-PH03-00", "WM-WF-PH03-01", "WM-WF-PH03-02", "WM-WF-PH03-03", "WM-WF-VN01-00", 
"WM-WF-PH02-70", "WM-WF-KB04-71", "WM-WF-KB04-72", "WM-WF-KB04-73", "WM-WF-PL00-70", "WM-WF-PL00-71", "WM-WF-PR00-70",
"WM-WF-PH04-70", "WM-WF-PH04-71", "WM-WF-BB04-70", "WM-WF-BB04-71", "WM-WF-VN04-70", "WM-WF-VN04-71",
"WM-WF-PH04-50", "WM-WF-PR00-50", "WM-WF-PL00-50", "WM-WF-BB04-50"]

nodeLocations = {}
nodeData = {}
nodeType = {}


function get_desc(nodeName){
    return new Promise((resolve, reject) => {
        // Make a GET request to the OM2M API
        axios.get(_url + _ae + _cnt+ nodeName + _desc, { headers })
            .then(response => {
                // Handle the response
                resolve(response.data["m2m:cin"].con);
            })
            .catch(error => {
                console.error(error); // Log any errors
                reject(error);
            });
    });
}
    

function get_data(nodeName){
    return new Promise((resolve, reject) => {
        // Make a GET request to the OM2M API
        axios.get(_url + _ae + _cnt+ nodeName + _data, { headers })
            .then(response => {
                // Handle the response
                resolve(response.data["m2m:cin"].con);
            })
            .catch(error => {
                console.error(error); // Log any errors
                reject(error);
            });
    });
}
    

router.get("/api/getNodeLocation", async (req, res) => {
    try {
        // iterating for each node in nodes array
        for (let i = 0; i < nodes.length; i++) {
            console.log(nodes[i])
            nodeInfo = await get_desc(nodes[i]);
            // parsing the xml data 
            nodeInfo = convert.xml2json(nodeInfo, options);
            nodeInfo = JSON.parse(nodeInfo);        
            // extracting the Node Location from nodeInfo json object
            nodeLocation = nodeInfo["obj"]["str"][1]["_attributes"]["val"];
            console.log(nodeLocation);
            nodeLocations[nodes[i]] = nodeLocation;
        }
        res.send(nodeLocations);

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/api/getNodeData", async (req, res) => {
    try {
        // iterating for each node in nodes array
        for (let i = 0; i < nodes.length; i++) {
            console.log(nodes[i])
            nodeInfo = await get_data(nodes[i]);
            
            console.log(nodeInfo);
            nodeData[nodes[i]] = JSON.parse(nodeInfo);
        }
        console.log(nodeData)
        res.send(nodeData);

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

function checkNodeType(node) {
    const secondLastDigit = node.charAt(node.length - 2);
    if (secondLastDigit === '0')
    {
        return "Shenitek";
    }
    else if (secondLastDigit === '5')
    {
        return "Kritsnam";
    }
    else
    {
        return "RF";
    }
}

// TEST TO CHECK IF NODE TYPE FUNCTION IS WORKING
// Loop through the nodes array and check each string
nodes.forEach(node => {
    // console.log(`${node}: ${checkNodeType(node)}`);
    nodeType[node] = checkNodeType(node);
});

console.log(nodeType);

module.exports = router;
