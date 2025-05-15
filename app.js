let cookies = 0;
let multiplier = 1;
let cps = 0;

function loadValues(){
    cookies = Number(localStorage.getItem("cookies")) || 0
    multiplier = Number(localStorage.getItem("multiplier")) || 1
    cps = Number(localStorage.getItem("cps")) || 0

    document.querySelector('#cookies-count-span').textContent = cookies;
}

loadValues()

function spawnNumber(x, y) {
    const editImage = document.createElement('img');
    const effect = document.createElement('div');

    effect.className = 'number-effect';
    editImage.src = "./images/cookieimg.png";
    editImage.style.width = "40px"
    editImage.style.height = "40px"
    effect.textContent = String(1 * multiplier)

    effect.style.left = x + 'px';
    effect.style.top = y + 'px';

    effect.appendChild(editImage);
    document.body.appendChild(effect);

    setTimeout(() => {
        effect.style.transform = 'translateY(60px)';
        effect.style.opacity = '0';
    }, 10);

    setTimeout(() => {
        effect.remove();
    }, 500);
}


function setValues(){
    localStorage.setItem("cookies", cookies)
    localStorage.setItem("multiplier", multiplier)
    localStorage.setItem("cps", cps)


    document.querySelector('#cookies-count-span').textContent = cookies;
}

async function getUpgradeData(){
    const response = await fetch("https://cookie-upgrade-api.vercel.app/api/upgrades") 
    const data = await response.json();
    const itemsContainer = document.getElementById("items-container")

    for (const [key, value] of Object.entries(data)){

        const newItemDiv = document.createElement("div")
        const newItemName = document.createElement("p")
        const newItemCost = document.createElement("p")
        const newItemIncrease = document.createElement("p")
        const newBuyButton = document.createElement("button")

        newItemDiv.classList.add("item-div")
        newItemName.classList.add("item-name")
        newItemIncrease.classList.add("item-increase")
        newItemCost.classList.add("item-cost")
        newBuyButton.classList.add("buy-button")

        itemsContainer.appendChild(newItemDiv)
        newItemDiv.appendChild(newItemName)
        newItemDiv.appendChild(newItemCost)
        newItemDiv.appendChild(newItemIncrease)
        newItemDiv.appendChild(newBuyButton)

        newItemName.innerText = value.name 
        newItemIncrease.innerText = "Increase: " + value.increase
        newItemCost.innerText = "Cost: " + value.cost
        newBuyButton.innerText = "Buy"

        newBuyButton.addEventListener("click", function(){
            if (cookies >= value.cost){
                cookies = Math.ceil(cookies - value.cost)
                cps = Math.ceil(cps + value.increase)
                value.cost = Math.ceil(value.cost * 1.1)
                newItemCost.innerText = "Cost: " + value.cost
                setValues()
            }
        })

    }

    return data;
};

getUpgradeData()



const cookie = document.getElementById('cookie');
cookie.addEventListener("click", (event) => {
    cookies = cookies + (1 * multiplier)  
    setValues()
    spawnNumber(event.clientX, event.clientY)
})

function tick(){
    cookies = cookies + cps
    setValues()
}

setInterval(function(){
    tick()
}, 1000)

let closed = false;
const closeButton = document.getElementById('closeButton')
const mainContainer = document.getElementById('main-container')
const cookieContainer = document.getElementById('cookie-container')
const cookieCount = document.getElementById('cookies-count')
const itemsContainer = document.getElementById('items-container')

closeButton.addEventListener("click", function(){
    closed = !closed
    if (closed){
        mainContainer.style.width = "3%"
        cookieContainer.style.width = "97%"
        closeButton.style.transform = 'rotate(180deg)'
        cookieCount.style.opacity = "0%"
        itemsContainer.style.opacity = "0%"
        setTimeout(function(){
            cookieCount.style.display = "none"
            itemsContainer.style.display = "none"
        }, 1500)
    } else {
        mainContainer.style.width = "50%"
        cookieContainer.style.width = "50%"
        closeButton.style.transform = 'rotate(0deg)'
        cookieCount.style.display = "flex"
        itemsContainer.style.display = "flex"
        cookieCount.style.opacity = "100%"
        itemsContainer.style.opacity = "100%"

    }
})