
let cookies = 0;
let multiplier = 1;
let cps = 0;
let upgradeValues = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0
};

let rebirthItemUpgrades = {
    0: 0,
    1: 0,
    2: 0
};

let rebirthMultiplier = 0;

let rotationSpeed = 30;

let newUpgradeCount = 0;
let newUpgrades = [];

let rebirths = 0;
let rebirthPoints = 0;

// Recursive function to convert number
function convert(n, suffix = '') {
    // Suffix array for thousands, millions, billions, etc.
    let suffixes = ['', 'K', 'M', 'B', 'T', 'Qd', 'Qt', 'Sx', 'St', 'O', 'N', 'D'];

    // Base case: if n is less than 1000, return the number with the suffix
    if (n < 1000) {
        return n.toFixed(1) + suffix;
    }

    // Recursive case: divide the number by 1000 and add the next suffix
    let index = suffix ? suffixes.indexOf(suffix) + 1 : 1;
    return convert(n / 1000, suffixes[index]);
}


function loadValues(){
    cookies = Number(localStorage.getItem("cookies")) || 0
    multiplier = 1e28
    cps = Number(localStorage.getItem("cps")) || 0
    upgradeValues = JSON.parse(localStorage.getItem("upgradeValues")) || upgradeValues
    newUpgrades = JSON.parse(localStorage.getItem("newUpgrades")) || newUpgrades
    newUpgradeCount = Number(localStorage.getItem("newUpgradeCount")) || 0
    rebirthPoints = Number(localStorage.getItem("rebirthPoints")) || 0
    rebirths = Number(localStorage.getItem("rebirths")) || 0
    rebirthItemUpgrades = JSON.parse(localStorage.getItem("rebirthItemUpgrades")) || rebirthItemUpgrades
    rebirthMultiplier = Number(localStorage.getItem("rebirthMultiplier")) || 0


    document.querySelector('#cookies-count-span').textContent = " " + convert(cookies);
    document.querySelector('#rebirth-count-span').textContent = " " + rebirths;
    document.querySelector('#rebirth-points-count-span').textContent = " " + rebirthPoints;
}

function clearData(){
        cookies = 0;
        multiplier = 0;
        cps = 0;
        upgradeValues = {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0
        };
        newUpgrades = [];
        newUpgradeCount = 0;
        rebirthPoints = 0;
        rebirths = 0;
        rebirthItemUpgrades = {
            0: 0,
            1: 0,
            2: 0
        };
        setValues()
    }
// clearData()
loadValues()

let rebirthItems = {
    0: {
        name: "Super Saiyan Bakers",
        cost: "5",
        increase: "50"
    },
    1: {
        name: "Godly Icing",
        cost: "10",
        increase: "1000"
    },
    2: {
        name: "Perfect Ingredients",
        cost: "50",
        increase: "5000"
    },
}

function rebirth(){
    if (cookies > 1e12){
        const baseCost = 1e12;
        const increment = 1.1;

        let cost = baseCost;
        while (cookies >= cost) {
            rebirthPoints++;
            cookies = Math.ceil(cookies - cost);
            cost *= increment;
        }
        rebirths++;
        cookies = 0
        upgradeValues = {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0
        };
        cps = 0
        newUpgrades = []
        newUpgradeCount = 0

        const blackOutScreen = document.getElementById("screen-blackout");
        const modalScreen = document.getElementById("rebirth-modal")
        blackOutScreen.style.display = "none"
        modalScreen.style.display = "none"
        rebirthCookies = setInterval(function(){
            createCookies()
        }, 10)
        rotationSpeed = 2;
        setTimeout(function(){
            clearInterval(rebirthCookies)
            rotationSpeed = 30;
        }, 5000)
        setValues()
        console.log(rebirthPoints)
    }
}


function spawnNumber(x, y) {
    const editImage = document.createElement('img');
    const effect = document.createElement('div');

    effect.className = 'number-effect';
    editImage.src = "./images/cookieimg.png";
    editImage.style.width = "40px"
    editImage.style.height = "40px"
    effect.textContent = String(1 * (multiplier + rebirthMultiplier))

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
    localStorage.setItem("upgradeValues", JSON.stringify(upgradeValues))
    localStorage.setItem("newUpgrades", JSON.stringify(newUpgrades))
    localStorage.setItem("newUpgradeCount", JSON.stringify(newUpgradeCount))
    localStorage.setItem("rebirthItemUpgrades", JSON.stringify(rebirthItemUpgrades))
    localStorage.setItem("rebirthPoints", rebirthPoints)
    localStorage.setItem("rebirths", rebirths)
    localStorage.setItem("rebirthMultiplier", rebirthMultiplier)
    localStorage.setItem("cps", (cps))


    document.querySelector('#cookies-count-span').textContent = ` ${convert(cookies)}`;
    document.querySelector('#rebirth-count-span').textContent =  ` ${rebirths}`;
    document.querySelector('#rebirth-points-count-span').textContent = " " + rebirthPoints;

    // const rebirthButton = document.getElementById("rebirth-button")
    // if (cookies >= 1e12) {
    //     rebirthButton.style.display = "flex"
    // } else {
    //     rebirthButton.style.display = "none"
    // }
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

        if (upgradeValues[key] > 0){
            newItemCost.innerText = "Cost: " + Math.ceil(value.cost * (1.1 + upgradeValues[key] / 8)) 
        } else {
            newItemCost.innerText = "Cost: " + value.cost
        }

        newBuyButton.innerText = "Buy"

        setInterval(function(){
            if (upgradeValues[key] > 0){
                if (cookies >= (value.cost * (1.1 + upgradeValues[key] / 8))){
                    newBuyButton.style.color = "green";
                } else {
                    newBuyButton.style.color = "red";
                }
            } else {
                if (cookies >= (value.cost)){
                    newBuyButton.style.color = "green";
                } else {
                    newBuyButton.style.color = "red";
                }
            }
        }, 1000)

        newBuyButton.addEventListener("click", function(){
            if (upgradeValues[key] > 0){
                console.log("UPG > 0, ", "Value.Cost: ", value.cost, "upgVAl: ", (1.1 + upgradeValues[key] / 8), "TOTAL: ", (value.cost * (1.1 + upgradeValues[key] / 8)))
                if (cookies >= (value.cost * (1.1 + upgradeValues[key] / 8))){
                    cookies = Math.ceil(cookies - (value.cost * (1.1 + upgradeValues[key] / 8)))
                    cps = Math.ceil(cps + value.increase)
                    upgradeValues[key] = upgradeValues[key] + 1
                    newItemCost.innerText = "Cost: " + Math.ceil(value.cost * (1.1 + upgradeValues[key] / 8))
    
                    setValues()
                }
            } else {
                if (cookies >= value.cost){
                    console.log("UPG < 0, ", "Value.Cost: ", value.cost)

                    cookies = Math.ceil(cookies - (value.cost))
                    cps = Math.ceil(cps + value.increase)
                    upgradeValues[key] = upgradeValues[key] + 1
                    newItemCost.innerText = "Cost: " + Math.ceil(value.cost * (1.1 + upgradeValues[key] / 8))
    
                    setValues()
                }
            }
        })

    }

    for (const [key, value] of Object.entries(newUpgrades)){
        console.log(key, " ", value.value)

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

        newItemName.innerText = value.value.name 
        newItemIncrease.innerText = "Increase: " + value.value.increase

        if (upgradeValues[value.value.upgradeValueIndex] > 0){
            newItemCost.innerText = "Cost: " + Math.ceil(value.value.cost * (1.1 + upgradeValues[value.value.upgradeValueIndex] / 8)) 
        } else {
            newItemCost.innerText = "Cost: " + value.value.cost
        }

        newBuyButton.innerText = "Buy"

        setInterval(function(){
            if (cookies >= (value.value.cost * (1.1 + upgradeValues[value.value.upgradeValueIndex] / 8))){
                newBuyButton.style.color = "green";
            } else {
                newBuyButton.style.color = "red";
            }
        }, 1000)

        newBuyButton.addEventListener("click", function(){
            if (cookies >= (value.value.cost * (1.1 + upgradeValues[value.value.upgradeValueIndex] / 8))){
                cookies = Math.ceil(cookies - (value.value.cost * (1.1 + upgradeValues[value.value.upgradeValueIndex] / 8)))
                cps = Math.ceil(cps + value.value.increase)
                upgradeValues[value.value.upgradeValueIndex] = upgradeValues[value.value.upgradeValueIndex] + 1
                newItemCost.innerText = "Cost: " + Math.ceil(value.value.cost * (1.1 + upgradeValues[value.value.upgradeValueIndex] / 8))

                setValues()
            }
        })
    } 

    return data;
};

getUpgradeData()

let modalOpen = false;

function OpenCloseModal(){
    const blackOutScreen = document.getElementById("screen-blackout");
    const modalScreen = document.getElementById("upgrade-modal")
    console.log(modalOpen)
    modalOpen = !modalOpen
    if (modalOpen){
        modalScreen.style.display = "flex"
        blackOutScreen.style.display = "flex"
    } else {
        modalScreen.style.display = "none"
        blackOutScreen.style.display = "none"
    }
}

let rebirthOpen = false;

function OpenCloseRebirth(){
    const blackOutScreen = document.getElementById("screen-blackout");
    const modalScreen = document.getElementById("rebirth-modal")
    console.log(rebirthOpen)
    rebirthOpen = !rebirthOpen
    if (rebirthOpen){
        modalScreen.style.display = "flex"
        blackOutScreen.style.display = "flex"
    } else {
        modalScreen.style.display = "none"
        blackOutScreen.style.display = "none"
    }
}

const form = document.getElementById('form')
function handleSubmit(event) {
    const blackOutScreen = document.getElementById("screen-blackout");
    const modalScreen = document.getElementById("upgrade-modal")
    event.preventDefault();

    const formData = new FormData(form)
    createNewUpgrade(formData.get("upgradeName"))
    modalScreen.style.display = "none"
    blackOutScreen.style.display = "none"

    modalOpen = false;
}

form.addEventListener("submit", handleSubmit);


function createNewUpgrade(upgradeName){
    newUpgradeCount = newUpgradeCount + 1
    let newUpgrade = {
        "name": upgradeName,
        "cost": 400000 * (newUpgradeCount**2),
        "increase": 2000 * ((newUpgradeCount * 2)**2),
        "upgradeValueIndex": 9 + newUpgradeCount
    };


    newUpgrades.push({
        key: newUpgradeCount,
        value: newUpgrade
    })

    upgradeValues[newUpgrade.upgradeValueIndex] = 0

    console.table(newUpgrades)

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

    newItemName.innerText = newUpgrade.name 
    newItemIncrease.innerText = "Increase: " + newUpgrade.increase

    if (upgradeValues[newUpgrade.upgradeValueIndex] > 0){
        newItemCost.innerText = "Cost: " + Math.ceil(newUpgrade.cost * (1.1 + upgradeValues[newUpgrade.upgradeValueIndex] / 8)) 
    } else {
        newItemCost.innerText = "Cost: " + newUpgrade.cost
    }

    newBuyButton.innerText = "Buy"

    setInterval(function(){
        if (cookies >= (newUpgrade.cost * (1.1 + upgradeValues[newUpgrade.upgradeValueIndex] / 8))){
            newBuyButton.style.color = "green";
        } else {
            newBuyButton.style.color = "red";
        }
    }, 1000)

    newBuyButton.addEventListener("click", function(){
        if (cookies >= (newUpgrade.cost * (1.1 + upgradeValues[newUpgrade.upgradeValueIndex] / 8))){
            cookies = Math.ceil(cookies - (newUpgrade.cost * (1.1 + upgradeValues[newUpgrade.upgradeValueIndex] / 8)))
            cps = Math.ceil(cps + newUpgrade.increase)
            upgradeValues[newUpgrade.upgradeValueIndex] = upgradeValues[newUpgrade.upgradeValueIndex] + 1
            newItemCost.innerText = "Cost: " + Math.ceil(newUpgrade.cost * (1.1 + upgradeValues[newUpgrade.upgradeValueIndex] / 8))

            setValues()
        }
    })


    setValues()
}


const cookie = document.getElementById('cookie');
let rotation = 0;

function createCookies(){
    const editImage = document.createElement('img');
    const effect = document.createElement('div');

    effect.className = 'number-effect';
    editImage.src = "./images/cookieimg.png";
    editImage.style.width = "80px"
    editImage.style.height = "80px"
    editImage.style.transform = 'translateY(60px)';
    effect.style.zIndex = -5
    editImage.style.zIndex = -5

    effect.style.left = (Math.random() * 80) + "%"
    effect.style.top = (Math.random() * 100) + "%"

    effect.appendChild(editImage);
    cookieContainer.appendChild(effect);

    setTimeout(() => {
        effect.style.transform = 'translateY(90%)';
        effect.style.opacity = '0';
    }, 30);

    setTimeout(() => {
        
        effect.remove();
    }, 3100);
}


setInterval(function(){
    rotation = rotation + 0.5
    cookie.style.transform = 'rotate(' + rotation + 'deg)'
}, rotationSpeed)

setInterval(function(){
    createCookies()
}, 200)

cookie.addEventListener("click", (event) => {
    cookies = cookies + (1 * (multiplier + rebirthMultiplier))
    setValues()
    spawnNumber(event.clientX, event.clientY)
    createCookies()
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
const rebirthButton = document.getElementById('rebirth-button')
const newUpgradeButton = document.getElementById('new-upgrade-button')

closeButton.addEventListener("click", function(){
    closed = !closed
    if (!rebirthShop){
        if (closed){
            mainContainer.style.width = "3%"
            cookieContainer.style.width = "97%"
            closeButton.style.transform = 'rotate(180deg)'
            cookieCount.style.opacity = "0%"
            itemsContainer.style.opacity = "0%"
            newUpgradeButton.style.opacity = "0%"
            setTimeout(function(){
                cookieCount.style.display = "none"
                itemsContainer.style.display = "none"
                newUpgradeButton.style.display = "none"
            }, 1500)
        } else {
            mainContainer.style.width = "50%"
            cookieContainer.style.width = "50%"
            closeButton.style.transform = 'rotate(0deg)'
            cookieCount.style.display = "flex"
            itemsContainer.style.display = "flex"
            newUpgradeButton.style.display = "flex"
            newUpgradeButton.style.opacity = "100%"
            cookieCount.style.opacity = "100%"
            itemsContainer.style.opacity = "100%"
    
        }
    } else {
        if (closed){
            mainContainer.style.width = "3%"
            cookieContainer.style.width = "97%"
            closeButton.style.transform = 'rotate(180deg)'
            rebirthCount.style.opacity = "0%"
            rebirthItemsContainer.style.opacity = "0%"
            rebirthPointCount.style.opacity = "0%"
            rebirthButton.style.opacity = "0%"
            rebirth
            setTimeout(function(){
                rebirthCount.style.display = "none"
                rebirthItemsContainer.style.display = "none"
                rebirthPointCount.style.display = "none"
                rebirthButton.style.display = "none"
            }, 1500)
        } else {
            mainContainer.style.width = "50%"
            cookieContainer.style.width = "50%"
            closeButton.style.transform = 'rotate(0deg)'
            rebirthCount.style.display = "flex"
            rebirthItemsContainer.style.display = "flex"
            rebirthButton.style.display = "flex"
            rebirthButton.style.opacity = "100%"
            rebirthCount.style.opacity = "100%"
            rebirthItemsContainer.style.opacity = "100%"
            rebirthPointCount.style.display = "flex"
            rebirthPointCount.style.opacity = "100%"
    
        }
    }
})

let rebirthShop = document.getElementById('rebirthShopButton')
let rebirthCount = document.getElementById('rebirth-count')
let rebirthPointCount = document.getElementById('rebirth-points-count')
let rebirthItemsContainer = document.getElementById('rebirth-items-container')

rebirthShop = false;

for (const [key, value] of Object.entries(rebirthItems)){
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

    rebirthItemsContainer.appendChild(newItemDiv)
    newItemDiv.appendChild(newItemName)
    newItemDiv.appendChild(newItemCost)
    newItemDiv.appendChild(newItemIncrease)
    newItemDiv.appendChild(newBuyButton)

    newItemName.innerText = value.name 
    newItemIncrease.innerText = "Increase: " + value.increase + "x Multiplier"

    console.log(rebirthItemUpgrades[key])
    if (rebirthItemUpgrades[key] > 0){
        newItemCost.innerText = "Cost: " + Math.ceil(value.cost * (rebirthItemUpgrades[key] * 10)) + " rebirth points"
    } else {
        newItemCost.innerText = "Cost: " + value.cost + " rebirth points"
    }

    newBuyButton.innerText = "Buy"

    setInterval(function(){
        if (rebirthItemUpgrades[key] > 0){
            if (rebirthPoints >= Math.ceil(value.cost * (rebirthItemUpgrades[key] * 10))){
                newBuyButton.style.color = "green";
            } else {
                newBuyButton.style.color = "red";
            }
        } else {
            if (rebirthPoints >= value.cost){
                newBuyButton.style.color = "green";
            } else {
                newBuyButton.style.color = "red";
            }
        }
    }, 1000)
    
    newBuyButton.addEventListener("click", function(){
        if (rebirthItemUpgrades[key] > 0) {
            if (rebirthPoints >= Math.ceil(value.cost * (rebirthItemUpgrades[key] * 10))){
                if (rebirthItemUpgrades[key] > 0) {
                    rebirthPoints = rebirthPoints - Math.ceil(value.cost * (rebirthItemUpgrades[key] * 10))
                } else {
                    rebirthPoints = rebirthPoints - Math.ceil(value.cost)
                }
                console.log("RM: ", rebirthMultiplier, " VI: ", value.increase)
                rebirthMultiplier = Math.ceil(rebirthMultiplier + value.increase)
                rebirthItemUpgrades[key] = rebirthItemUpgrades[key] + 1
                newItemCost.innerText = "Cost: " + Math.ceil(value.cost * (rebirthItemUpgrades[key] * 10)) + " rebirth points"
                setValues()
            }
        } else {
            if (rebirthPoints >= Math.ceil(value.cost)){
                if (rebirthItemUpgrades[key] > 0) {
                    rebirthPoints = rebirthPoints - Math.ceil(value.cost * (rebirthItemUpgrades[key] * 10))
                } else {
                    rebirthPoints = rebirthPoints - Math.ceil(value.cost)
                }
                console.log("RM: ", rebirthMultiplier, " VI: ", value.increase)
                rebirthMultiplier = Math.ceil(rebirthMultiplier + value.increase)
                rebirthItemUpgrades[key] = rebirthItemUpgrades[key] + 1
                newItemCost.innerText = "Cost: " + Math.ceil(value.cost * (rebirthItemUpgrades[key] * 10)) + " rebirth points"
                setValues()
            }
        }
    })
}

rebirthShopButton.addEventListener("click", function(){
    if (!closed){
        rebirthShop = !rebirthShop 
        if (rebirthShop){
            itemsContainer.style.display = "none"
            cookieCount.style.display = "none"
            newUpgradeButton.style.display = "none"
            rebirthButton.style.display = "flex"
            rebirthCount.style.display = "flex"
            rebirthPointCount.style.display = "flex"
            rebirthItemsContainer.style.display = "flex"
        } else {
            itemsContainer.style.display = "flex"
            cookieCount.style.display = "flex"
            newUpgradeButton.style.display = "flex"
            rebirthButton.style.display = "none"
            rebirthCount.style.display = "none"
            rebirthPointCount.style.display = "none"
            rebirthItemsContainer.style.display = "none"
        }
    }
})

