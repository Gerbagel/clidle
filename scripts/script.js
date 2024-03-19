var consoleBox = document.querySelector("#console")
var inputBox = document.querySelector("#commandinput")

/*onload = (event) => {
    inputBox.focus()
}*/

function executeCommand() {
    consoleBox.innerHTML += inputBox.value + " <br />"
    inputBox.value = ""
}