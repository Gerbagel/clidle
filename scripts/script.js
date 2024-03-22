let consoleBox = document.querySelector("#console")
let inputBox = document.querySelector("#commandinput")
let endl = "<br />"
let breakl = "================================" + endl
let userString = "root@root:~$ "
var commands = {}
var commandHistory = []
var commandHistoryLoc = null
var bits = localStorage.getItem("bits") || 0
var bytes = localStorage.getItem("bytes") || 0

const command = {
    args: "none",
    desc: "",
    function: undefined
}

function addLineToConsole(line) {
    consoleBox.innerHTML += line + endl
}

function displayBits() {
    var stringToShow = "Bits: "
    for (var i = 0; i < bits; i++) {
        stringToShow += "▮"
    }
    for (var i = 0; i < 8 - bits; i++) {
        stringToShow += "▯"
    }
    stringToShow += " (" + bits + ")"
    addLineToConsole(stringToShow)
}

function displayBytes() {
    addLineToConsole("Bytes: " + bytes)
}

onload = async (event) => {
    let lastLogin = localStorage.getItem("lastLogin")
    if (lastLogin !== null) {
        addLineToConsole("Last login: " + new Date(lastLogin).toLocaleString('en-GB') + endl)
    }

    displayBits()
    displayBytes()
    addLineToConsole(endl)

    var jsonCommands
    await fetch("scripts/commands/commands.json")
        .then((response) => response.json())
        .then((json) => jsonCommands = json);

    for (const elem in jsonCommands.commands) {
        var commandObj = Object.create(command)
        commandObj.args = jsonCommands.commands[elem]["args"]
        commandObj.desc = jsonCommands.commands[elem]["desc"]
        commandObj.function = jsonCommands.commands[elem]["function"]
        commands[elem] = commandObj
    }

    console.log(commands)

    inputBox.onblur = () => {
        setTimeout(() => inputBox.focus(), 20)
    }
}

window.onbeforeunload = (event) => {
    localStorage.setItem("lastLogin", new Date())
}

inputBox.onkeydown = (event) => {
    // if arrow up, go up in command history
    if (event.key === "ArrowUp") {
        if (commandHistoryLoc === null) {
            commandHistoryLoc = commandHistory.length-1
        }
        else {
            commandHistoryLoc--
            if (commandHistoryLoc < 0) {commandHistoryLoc = 0}
        }
        if (commandHistory[commandHistoryLoc] != undefined)
        {
            inputBox.value = commandHistory[commandHistoryLoc]
        }
    }
    // if arrow down, go down in command history
    else if (event.key === "ArrowDown") {
        if (commandHistoryLoc === commandHistory.length-1) {commandHistoryLoc = null}
        if (commandHistoryLoc != null) {
            commandHistoryLoc++
            inputBox.value = commandHistory[commandHistoryLoc]
        }
        else {
            inputBox.value = ""
        }
    }
}

function executeCommand() {
    inputBox.value.trim()
    commandHistory.push(inputBox.value)
    commandHistoryLoc = null
    addLineToConsole(userString + inputBox.value)

    if (inputBox.value !== "" && !inputBox.value !== " ") {
        var command = inputBox.value.split(' ')
        if (commands[command[0]] !== undefined) {
            if (command[1] !== undefined && command[1] === "--help") {
                helpCommand(command[0])
            }
            else {
                eval(commands[command[0]].function)
            }
        }
    }
    
    inputBox.value = ""

    // every time a command is executed, update last login time
    localStorage.setItem("lastLogin", new Date())
}

function helpCommand(command) {
    let descString = "Usage: " + command + endl
    descString += "Description: " + commands[command]["desc"]
    if (commands[command]["args"] !== "none") {
        descString += endl + "Args: " + commands[elem]["args"]
    }
    addLineToConsole(descString)
}

function crunch() {
    bits++

    if (bits === 8)
    {
        bits = 0
        displayBits()
        bytes++
        displayBytes()
    }
    else {
        displayBits()
    }

    localStorage.setItem("bits", bits)
    localStorage.setItem("bytes", bytes)
}

function help() {
    for (const elem in commands)
    {
        let descString = breakl + "Usage: " + elem + endl
        descString += "Description: " + commands[elem]["desc"]
        if (commands[elem]["args"] !== "none")
        {
            descString += endl + "Args: " + commands[elem]["args"]
        }
        addLineToConsole(descString)
    }
}

function reset() {
    addLineToConsole(inputBox.value)
    localStorage.clear()
}

function status() {
    displayBits()
    displayBytes()
}