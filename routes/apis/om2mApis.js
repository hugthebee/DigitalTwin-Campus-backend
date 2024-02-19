const axios = require('axios');
const express = require('express');
const router = express.Router();
const cors = require('cors');

const _url = "http://onem2m.iiit.ac.in:443/~/in-cse/in-name/";
const _ae = "AE-WM/";
const _cnt = "WM-WF/";
const _desc = "/Descriptor/la/";
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

nodes = ["WM-WF-PH01-00"]
nodeLocations = {}


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
    

router.get("/api/getNodeInfo", async (req, res) => {
    try {
        // iterating for each node in nodes array
        for (let i = 0; i < nodes.length; i++) {
            nodeInfo = await get_desc(nodes[i]);
            // parsing the xml data 
            nodeInfo = convert.xml2json(nodeInfo, options);
            nodeInfo = JSON.parse(nodeInfo);        
            // extracting the Node Location from nodeInfo json object
            nodeLocation = nodeInfo["obj"]["str"][1]["_attributes"]["val"];
            console.log(nodeLocation);
            nodeLocations["WM-WF-PH01-00"] = nodeLocation;

            res.send(nodeLocation);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router;
