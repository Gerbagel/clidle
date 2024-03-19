let consoleBox = document.querySelector("#console")
let inputBox = document.querySelector("#commandinput")
var commands = {};

const command = {
    args: "none",
    desc: "",
    function: undefined
}

onload = async (event) => {
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

function executeCommand() {
    consoleBox.innerHTML += "<br />" + inputBox.value + " <br />"

    if (inputBox.value !== "" && !inputBox.value !== " ") {
        var command = inputBox.value.split(' ')

        if (command[1] !== undefined && command[1] === "--help") {
            helpCommand(command[0])
        }
        else {
            eval(commands[command[0]].function)
        }
    }
    
    inputBox.value = ""
}

function helpCommand(command) {
    let descString = "Usage: " + command + " <br />"
    descString += "Description: " + commands[command]["desc"] + "<br />"
    if (commands[command]["args"] !== "none") {
        descString += "Args: " + commands[elem]["args"] + " <br />"
    }
    consoleBox.innerHTML += descString
}

function help() {
    for (const elem in commands)
    {
        let descString = "<hr />Usage: " + elem + " <br />"
        descString += "Description: " + commands[elem]["desc"] + " <br />"
        if (commands[elem]["args"] !== "none")
        {
            descString += "Args: " + commands[elem]["args"] + " <br />"
        }
        consoleBox.innerHTML += descString
    }
}

function crunch() {
    consoleBox.innerHTML += "CRUNCH! <br />"
}