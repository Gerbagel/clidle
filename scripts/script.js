let consoleBox = document.querySelector("#console")
let inputBox = document.querySelector("#commandinput")
let endl = "<br />"
let breakl = "================================" + endl
let userString = "root@root:~$ "
var commands = {}

const command = {
    args: "none",
    desc: "",
    function: undefined
}

function addLineToConsole(line) {
    consoleBox.innerHTML += line + endl
}

onload = async (event) => {
    let lastLogin = localStorage.getItem("lastLogin")
    if (lastLogin !== null) {
        consoleBox.innerHTML += "<br /><p>Last login: " + new Date(lastLogin).toLocaleString('en-GB') + "</p>"
    }

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

function executeCommand() {
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

function crunch() {
    addLineToConsole("CRUNCH!")
}

function reset() {
    addLineToConsole(inputBox.value)
    localStorage.clear()
}