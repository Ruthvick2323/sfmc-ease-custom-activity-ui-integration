window.onload = function () {
    document.getElementById("moveRight").addEventListener("click", moveSelectedRight);
    document.getElementById("moveLeft").addEventListener("click", moveSelectedLeft);
}

function moveSelectedRight() {
    moveSelected("availableFieldsListBox", "selectedFieldsListBox");
}

function moveSelectedLeft() {
    moveSelected("selectedFieldsListBox", "availableFieldsListBox");
}

function moveSelected(source, destination, alertMessage) {
    var sourceListBox = document.getElementById(source);
    var removeIndexes = [];
    var destinationListBox = document.getElementById(destination);
    Array.prototype.forEach.call(sourceListBox.options, function(currentOption, index) {
        if(currentOption.selected) {
            var optionClone = getOptionClone(currentOption);
            destinationListBox.add(optionClone);
            removeIndexes.push(index);
        }
    });

    removeOptions(sourceListBox, removeIndexes);
}

function getOptionClone(currentOption) {
    var optionClone = document.createElement('option');
    optionClone.value = currentOption.value;
    optionClone.innerHTML = currentOption.innerHTML;
    return optionClone;
}

function removeOptions(listBox, removeIndexes) {
    removeIndexes.slice().reverse().forEach(function(index) {
        listBox.remove(index);
    });
}