const BASE_URL="https://api.frankfurter.dev/v1/latest"

const dropdowns=document.querySelectorAll(".dropdown select");
const btn=document.querySelector("#submit");
const fromCurr=document.querySelector(".from select");
const toCurr=document.querySelector(".to select");
const msg=document.querySelector(".msg");
const ex_rate=document.querySelector(".ex_rate");
const ex_icon=document.querySelector("#ex_icon");

for(let select of dropdowns){
    for(let currCode in countryList){
        let newOption= document.createElement("option");
        newOption.innerText=currCode;
        newOption.value=currCode;
        if(select.name==="from" && currCode==="USD"){
            newOption.selected="selected";
        }
        else if(select.name==="to" && currCode==="INR"){
            newOption.selected="selected";
        }
        select.append(newOption);
    }

    select.addEventListener("change",(evt) => {
        updateFlag(evt.target);
    });
}

const updateFlag= (element) => {
    let currCode=element.value;
    let countryCode=countryList[currCode];
    let newSrc= `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img=element.parentElement.querySelector("img");
    img.src=newSrc;
}

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
})



const updateExchangeRate = async () => {
    let amount=document.querySelector(".amount input");
    let amtVal=amount.value;
    if(amtVal==="" || amtVal<1){
        amtVal=1;
        amount.value="1";
    }

    if(fromCurr.value===toCurr.value){
        ex_rate.innerText = `1 ${fromCurr.value} = 1 ${toCurr.value}`;
        msg.innerText = `${amtVal} ${fromCurr.value} = ${amtVal} ${toCurr.value}`;
        return;
    }

    try{
            const URL= `${BASE_URL}?base=${fromCurr.value}&symbols=${toCurr.value}`;
        let response=await fetch(URL);
        let data= await response.json();
        let rate=data.rates[toCurr.value];

        let finalAmt= (amtVal*rate).toFixed(2);
        ex_rate.innerText=`1 ${fromCurr.value} = ${rate} ${toCurr.value}`;
        msg.innerText= `${amtVal} ${fromCurr.value} = ${finalAmt} ${toCurr.value}`;
    }catch(error){
        msg.innerText = "Failed to fetch exchange rate. Please try again.";
        ex_rate.innerText="--"
        console.error(error);
    }
}

window.addEventListener("load", ()=> {
    updateExchangeRate();
})


document.addEventListener('DOMContentLoaded', ()=> {
    const darkmode=document.querySelector("#darkmode");
    darkmode.addEventListener('click', () => {
    document.body.classList.toggle('darkmode'); //switches from dark and light
    const icon=document.querySelector("#darkmode img");
    if(document.body.classList.contains("darkmode")){
        darkmode.innerText=`Light Mode`;
        icon.src="icons/sun.png";
        darkmode.prepend(icon);
        icon.style.height="1.5rem";
        icon.style.width="1.5rem";
    }else{
        darkmode.innerText="Dark Mode";
        icon.src="icons/moon.png";
        darkmode.prepend(icon);
    }
    })
})

ex_icon.addEventListener("click", (evt) => {
    evt.preventDefault();
    let temp=fromCurr.value;
    fromCurr.value=toCurr.value;
    toCurr.value=temp;
    updateFlag(fromCurr);
    updateFlag(toCurr);
    updateExchangeRate();
})
