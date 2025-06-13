const { log } = require("console");
const { json } = require("stream/consumers");
// const fetch = require('node-fetch');

const BASE_URL = "https://v6.exchangerate-api.com/v6/";
const API_KEY = process.env.API_KEY;

exports.handler = async function(event, context){
    const eventBody = JSON.parse(event.body);
    const currencyCode = eventBody.code;
    console.log(currencyCode);
    
    const apiData = await fetch(`${BASE_URL}${API_KEY}/latest/${currencyCode}`)
    .then(res=>res.json())
    .catch(error=>{
        return {
            statusCode: 404,
            body: JSON.stringify({
                message: error
            })
        }
    })
    // console.log(apiData);
    
    return {
        statusCode:200,
        body: JSON.stringify(apiData)
    }
}