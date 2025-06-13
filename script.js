// import countryList from codes.js;
var fromDiv = document.querySelector("#from select");
var toDiv = document.querySelector("#to select");   //TO GET NAME OF TO COUNTRY AND SET IMAGE AS PER THAT
var dropdown = document.querySelectorAll(".selection select"); //TO DISPLAY ALL LIST OF CONTREIS FROM CODES.JS FILE
var changeValDiv = document.querySelector("#changeVal");    //TO DISPLAY CURRENT VALUE OF THAT CURRENCY
var btn = document.querySelector("main button");    //TO MAKE THINGS WORK WHEN CLICKED
var amtVal = document.querySelector("#amtVal");
var mainRes = document.querySelector("main h2");
let finalVal = 0;
let convertedRatesArr = "";
let data = "";
let currCode = "";
let toCnt = "";
let frmCnt = "";

for (let select of dropdown) {
    // console.log(select);
    for (let currCode in countryList) {
        let newOptions = document.createElement("option");
        newOptions.innerText = currCode;    //innertext of option is set to currCode
        newOptions.value = currCode;        //value attribute of option is set

        select.append(newOptions);      //as we done querySelectorAll, we got nodelist in return and that's why we can append
    }
    select.addEventListener("change", (evt) => {
        // console.log(evt);
        updateFlag(evt.target);         //in target we have list of options (i.e 159 countries)
        if (select.name == "from") {
            updateExchangeRate(evt.target.value);
            frmCnt = evt.target.value;
            // console.log(frmCnt);
        }
        else if (select.name == "to") {
            getTodivCountry(evt.target.value);
            toCnt = evt.target.value;
        }
    })
}
//  ************************    UPDATE FLAG *******************************
function updateFlag(elem) {
    let currCode = elem.value;
    let cntCode = countryList[currCode];
    // console.log(cntCode+":"+currCode);
    newSrc = `https://flagsapi.com/${cntCode}/flat/64.png`;
    let img = elem.parentElement.querySelector("IMG");      //DONE THIS  AS IT WAS DIFFICULT TO DIFFERENTIATE BETWEEN IMG TAG OF #FROM AND #TO DIVS
    img.src = newSrc;      //will replace src of elem's dropdown.
}

async function updateExchangeRate(elem, toCnt = "INR") {
    frmCnt = elem;
    var amtVal = document.querySelector("#amtVal");
    if (amtVal.value == "" || amtVal.value < 1) {
        amtVal.value = 1;
    }

    currCode = elem;      //will give USD, INR, AUD, etc value
    // const URL = baseURL + currCode;
    // var response = await fetch(URL);
    var response = await fetch('/.netlify/functions/main', {
        method: 'POST',
        body: JSON.stringify({
            code: currCode,
        })
    });
    data = await response.json();
    console.log(data);
    
    if (data.result == "success") {
        convertedRatesArr = data.conversion_rates;
        // console.log(convertedRatesArr);
        changeValDiv.innerText = `1 ${currCode} = ${convertedRatesArr[toCnt]} ${toCnt}`;
        finalVal = amtVal.innerText * convertedRatesArr[toCnt];
    }
    else {
        alert("error occured");
    }
}

function getRates(){
    changeValDiv.innerText = `1 ${currCode} = ${convertedRatesArr[toCnt]} ${toCnt}`;
    finalVal = amtVal.value * convertedRatesArr[toCnt];
    finalVal = finalVal.toFixed(3);
}

function getTodivCountry(elem) {
    toCnt = elem;
    convertedRatesArr = data.conversion_rates;
    // console.log(convertedRatesArr[elem.value]);
    getRates();
}

btn.addEventListener("click", function () {
    updateExchangeRate(frmCnt, toCnt);
    getRates();
    mainRes.innerText = `${amtVal.value} ${frmCnt} = ${finalVal} ${toCnt}`;
});

amtVal.addEventListener("keydown", function (event) {
    if (event.code === 'Enter' || event.key === 'Enter' || event.keyCode === 13) {
        updateExchangeRate(frmCnt, toCnt);
        getRates();
        mainRes.innerText = `${amtVal.value} ${frmCnt} = ${finalVal} ${toCnt}`;
    }
})
