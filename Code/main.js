// Variables
let elements = {
    // Main
    menu: document.querySelector("#menu"),
    mode: document.querySelector("#modeButtons"),
    game: document.querySelector("#game"),
    result: document.querySelector("#result"),
    stats: document.querySelector("#statsDiv"),
    return: document.querySelector("#returnButton"),

    // Sub
    menuButtons: document.querySelector("#menuButtons"),
    flagCount: document.querySelector("#flagCount"),
    flagDisplay: document.querySelector("#flagDisplay"),
    options: document.querySelector("#options"),

    resultContinent: document.querySelector("#resultContinent"),
    resultScore: document.querySelector("#resultScore"),
    correctBar: document.querySelector("#correctBar"),
    percentage: document.querySelector("#percentageText"),
};

const buttons = [
    document.querySelector("#button1"),
    document.querySelector("#button2"),
    document.querySelector("#button3"),
    document.querySelector("#button4"),
]

const scores = [
    document.querySelector("#Europe_Stat"),
    document.querySelector("#NorthAmerica_Stat"),
    document.querySelector("#SouthAmerica_Stat"),
    document.querySelector("#Asia_Stat"),
    document.querySelector("#Africa_Stat"),
    document.querySelector("#Oceania_Stat"),
]

const continents = [
    "Europe",
    "NorthAmerica",
    "SouthAmerica",
    "Asia",
    "Africa",
    "Oceania",
]

const flags = {
    Europe: ["albania", "austria", "belarus", "belgium", "bosnia_and_herzegovina", "bulgaria", "czech_republic", "denmark", "estonia", "finland", "france", "germany", "greece", "hungary", "iceland", "ireland", "italy", "kosovo", "latvia", "liechtenstein", "lithuania", "luxembourg", "malta", "moldova", "monaco", "montenegro", "netherlands", "north_macedonia", "norway", "portugal", "romania", "russia", "san_marino", "serbia", "slovakia", "slovenia", "spain", "sweden", "switzerland", "ukraine", "united_kingdom"],
    NorthAmerica: ["belize", "canada", "costa_rica", "cuba", "dominican_republic", "el_salvador", "guatemala", "haiti", "honduras", "jamaica", "mexico", "nicaragua", "panama", "united_states"],
    SouthAmerica: ["argentina", "bolivia", "brazil", "chile", "colombia", "ecuador", "guyana", "paraguay", "peru", "suriname", "uruguay", "venezuela"],
    Asia: ["afghanistan", "armenia", "azerbaijan", "bahrain", "bangladesh", "bhutan", "brunei", "cambodia", "china", "georgia", "india", "indonesia", "iran", "iraq", "israel", "japan", "jordan", "kazakhstan", "kuwait", "kyrgyzstan", "laos", "lebanon", "malaysia", "mongolia", "myanmar", "nepal", "north_korea", "oman", "pakistan", "philippines", "qatar", "russia", "saudi_arabia", "singapore", "south_korea", "syria", "taiwan", "tajikistan", "thailand", "turkey", "turkmenistan", "united_arab_emirates", "uzbekistan", "vietnam", "yemen"],
    Africa: ["algeria", "angola", "benin", "botswana", "burkina_faso", "burundi", "cameroon", "cape_verde", "central_african_republic", "chad", "comoros", "democratic_repulic_congo", "djibouti", "egypt", "equatorial_guinea", "eritrea", "eswatini", "ethiopia", "gabon", "ghana", "guinea", "guinea_bissau", "ivory_coast", "kenya", "lesotho", "liberia", "libya", "madagascar", "malawi", "mali", "mauritania", "mauritius", "morocco", "mozambique", "namibia", "niger", "nigeria", "republic_congo", "rwanda", "são_tomé_and_príncipe", "senegal", "seychelles", "sierra_leone", "somalia", "south_africa", "south_sudan", "sudan", "tanzania", "the_gambia", "togo", "tunisia", "uganda", "zambia"],
    Oceania: ["australia", "fiji", "kiribati", "marshall_islands", "micronesia", "nauru", "new_zealand", "palau", "papua_new_guinea", "samoa", "solomon_islands", "tonga", "tuvalu", "vanuatu"],
};

const colors = {
    correct: "rgb(94, 242, 143)",
    incorrect: "rgb(255, 0, 0)",
    default: "rgb(60, 60, 60)",
};

const extension = ".png";

let gameConditions = {
    userScore: 0,
    countScore: 0,
    remainingFlags: 0,
    continent: "none",
    newFlags: [],
};

let canPlay = false;

// Functions
function ReturnMenu() {
    elements.menu.style.visibility = "visible";
    elements.mode.style.visibility = "hidden";
    elements.stats.style.visibility = "hidden";
    elements.game.style.visibility = "hidden";
    elements.result.style.visibility = "hidden";

    gameConditions.userScore = 0;
    gameConditions.newFlags = [];

    canPlay = false;
}

function GoPlay() {
    elements.menu.style.visibility = "hidden";
    elements.mode.style.visibility = "visible";

    console.log("User has gone to mode selection");
}

function GoStats() {
    for (const continent of continents) {
        const scoreData = LoadData(continent);
        console.log("Called data for", continent)

        if (scoreData) {
            for (const element of scores) {
                let elementId = element.id;
                if (elementId.split("_")[0] === continent) {
                    element.innerHTML = `${continent} - ${parseInt(scoreData)}`;
                    break
                }
            }
        } else {
            for (const element of scores) {
                let elementId = element.id;
                if (elementId.split("_")[0] === continent) {
                    element.innerHTML = `${continent} - N/A;`
                    break
                }
            }
        }
    }

    elements.menu.style.visibility = "hidden";
    elements.stats.style.visibility = "visible";
}

function LoadData(dataName) {
    return localStorage.getItem(dataName);
}

function SaveData(points) {
    if (points === true) { // Saving points
        const pastData = LoadData(gameConditions.continent);

        if (pastData) {
            if (parseInt(pastData) < gameConditions.userScore) {
                localStorage.setItem(gameConditions.continent, gameConditions.userScore.toString());
                console.log(("Successfully saved points to Local Storage"))
            } else {
                console.log("Points were not higher than past score...")
            }
        } else {
            localStorage.setItem(gameConditions.continent, gameConditions.userScore.toString());
            console.log(("Successfully saved points to Local Storage for first time!"))
        }
    } else { // Saving name
        localStorage.setItem("name", "");
        console.log(("Successfully saved name to Local Storage"))
    }
}

function GoResults() {
    const percent = (Math.floor((gameConditions.userScore / flags[gameConditions.continent].length) * 100));
    elements.resultContinent.innerHTML = gameConditions.continent;
    elements.resultScore.innerHTML = `${gameConditions.userScore} / ${flags[gameConditions.continent].length}`;
    elements.correctBar.style.width = `${percent}%`;
    elements.percentage.innerHTML = `${percent}%`

    elements.game.style.visibility = "hidden";
    elements.result.style.visibility = "visible";
}

function MenuPressed(event) {
    const target = event.target.id;

    if (target === "play") {
        GoPlay();
    } else if (target === "stats") {
        GoStats();
    }
}

function SelectMode(event) {
    const mode = event.target.id;
    if (flags[mode]) {
        elements.mode.style.visibility = "hidden";
        elements.game.style.visibility = "visible";

        GameSetup(mode);
        console.log(`User has chosen ${mode}`);
    }
}

function SelectFlag() {
    const flagToDisplay = gameConditions.newFlags[0];
    const flagInFolder = `url("../Assets/Flags/${gameConditions.continent}/${flagToDisplay}.png")`;
    elements.flagDisplay.style.backgroundImage = flagInFolder;

    const randomIndex = Math.floor(Math.random() * buttons.length);
    const correctButton = buttons[randomIndex];
    correctButton.innerHTML = flagToDisplay;
    
    const decoys = [];
    for (const button of buttons) {
        if (button.id !== correctButton.id) {
            while (true) {
                const decoyIndex = Math.floor(Math.random() * flags[gameConditions.continent].length);
                const decoyFlag = flags[gameConditions.continent][decoyIndex];
                if (decoyFlag !== gameConditions.newFlags[0] && !decoys[decoyFlag]) {
                    button.innerHTML = flags[gameConditions.continent][decoyIndex];
                    decoys.push(flags[gameConditions.continent][decoyIndex]);
                    break
                }
            }
        } 
    }
    canPlay = true;
}

function Guess(event) {
    if (canPlay === true) {
        const button = event.target;
        const flagGuess = button.innerHTML;
        for (const flagCheck of flags[gameConditions.continent]) {
            if (flagGuess === flagCheck) {
                canPlay = false;
                if (flagGuess === gameConditions.newFlags[0]) {
                    console.log("correct");
                    gameConditions.userScore += 1
                    button.style.backgroundColor = colors.correct;
                } else {
                    console.log("incorrect");
                    button.style.backgroundColor = colors.incorrect;
                }
                gameConditions.countScore += 1;
                elements.flagCount.innerHTML = `${gameConditions.countScore} / ${flags[gameConditions.continent].length}`
            
                setTimeout(function() {
                   button.style.backgroundColor = colors.default;
                   gameConditions.newFlags.splice(0, 1);
                   if (gameConditions.newFlags.length === 0) {
                        SaveData(true);
                        GoResults();
                   } else {
                        SelectFlag();
                   }
                }, 1000);
                break;
            }
        }
    }
}

function GameSetup(continent) {
    canPlay = true;
    flagArray = flags[continent];

    for (let flag = 0; flag < flagArray.length; flag += 1) {
        while (true) {
               let randomNumber = Math.floor(Math.random() * flagArray.length);
               let randomFlag = flagArray[randomNumber];
   
               if (!gameConditions.newFlags.includes(randomFlag)) {
                   gameConditions.newFlags.push(randomFlag);
                   break
                }
        }
    }
    gameConditions.continent = continent;
    gameConditions.userScore = 0;
    gameConditions.countScore = 0;
    gameConditions.remainingFlags = gameConditions.newFlags.length;

    elements.flagCount.innerHTML = `${gameConditions.countScore} / ${flags[gameConditions.continent].length}`;

    SelectFlag();
}

// Connections
elements.menuButtons.addEventListener("click", () => MenuPressed(event))
elements.mode.addEventListener("click", () => SelectMode(event))
elements.options.addEventListener("click", () => Guess(event))
elements.return.addEventListener("click", () => ReturnMenu(event))