var a;
var b;
var operator = '+';
var startTime = undefined;
var maxValue = 50;

function onHtmlLoad() {
    subscribeEnter();
}

function createNewExcercise() {
    operator = document.getElementById('op').value;
    let subtitleElement = document.getElementById('subtitle');
    if (operator == '+') {
        generateAddition();
        subtitleElement.innerHTML = 'Összeadás';
    } else if (operator == '-') {
        generateSubstraction();
        subtitleElement.innerHTML = 'Kivonás';
    } else if (operator == '×') {
        generateMultiplication();
        subtitleElement.innerHTML = 'Szorzás';
    } else if (operator == ':') {
        generateDivision();
        subtitleElement.innerHTML = 'Osztás';
    }

    displayExcercise();
    document.getElementById('result').focus();

    startMeasurementIfNeeded();
}

function displayExcercise() {
    document.getElementById('operator').innerHTML = operator;
    document.getElementById('a').innerHTML = a;
    document.getElementById('b').innerHTML = b;
    document.getElementById('result').value = '';
}

function generateAddition() {
    if (isStepOverTenChecked()) {
        a = getRandomNumber(2, maxValue - 11);
        b = getRandomNumber(maxValue - a, 9);
    } else {
        a = getRandomNumber(2, maxValue - 1);
        b = getRandomNumber(1, maxValue - a);
    }
}

function generateSubstraction() {
    if (isStepOverTenChecked()) {
        let c = getRandomNumber(2, maxValue - 11);
        b = getRandomNumber(maxValue - c, 9);
        a = b + c;
    } else {
        let c = getRandomNumber(2, maxValue - 1);
        b = getRandomNumber(1, maxValue - c);
        a = b + c;
    }
}

function onOperationChanged() {
    let newOp = document.getElementById('op').value;
    hideOrShowStepOverTen(newOp);
    updateMaximumValueName(newOp);
    clearExcercise();
}

function onMaxValueChanged() {
    let maxValueText = document.getElementById('maxValueInput').value; 
    maxValue = Number(maxValueText);
    console.info('New max value: ' + maxValue);
    clearExcercise();
}

function clearExcercise() {
    a = '';
    b = '';
    operator = '';
    displayExcercise();
}

function isStepOverTenChecked() {
    let isChecked = document.getElementById('stepOverTenInput').checked;
    console.info('isStepOverTenChecked -> ' + isChecked);
    return isChecked;
}

function generateMultiplication() {
    b = getRandomNumber(1, 10);
    let maxA = Math.floor(maxValue / 10);
    a = getRandomNumber(2, maxA);
}

function generateDivision() {
    let maxB = Math.floor(maxValue / 10);
    b = getRandomNumber(2, maxB);
    let c = getRandomNumber(2, 10);
    a = b * c;
}

function startMeasurementIfNeeded() {
    let isMeasurementOn = document.getElementById('measureTimeInput').checked;
    if (isMeasurementOn == true) {
        startTime = new Date().getTime();
    } else {
        startTime = undefined;
    }
}

function hideOrShowStepOverTen(newOperator) {
    document.getElementById('stepOverTenRow').style.display = newOperator == '+' || newOperator == '-' ? 'block' : 'none';
}

function subscribeEnter() {
    let resultElement = document.getElementById('result');
    resultElement.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && resultElement.value && resultElement.value !== '') {
            event.preventDefault();
            check();
            createNewExcercise();
        }
    });
}

function check() {
    let expected;
    if (operator == '+') {
        expected = a + b;
    } else if (operator == '-') {
        expected = a - b;
    } else if (operator == '×') {
        expected = a * b;
    } else if (operator == ':') {
        expected = a / b;
    }
    checkWithCurrentValue(expected);
}

function checkWithCurrentValue(expectedValue) {
    let current = document.getElementById('result').value;
    let soltuionsBodyElement = document.getElementById('solutions-body');
    let excercise = '' + a + operator + b + '=' + expectedValue;
    let duration = '';
    if (startTime !== undefined) {
        let endTime = new Date().getTime();
        let durationInMs = endTime - startTime;
        duration = Math.floor(durationInMs / 1000);
    }

    let newSolutionRows = soltuionsBodyElement.innerHTML;
    if (current == expectedValue) {
        newSolutionRows =
            '<tr><td>' + excercise + '</td><td>Helyes</td><td></td><td>' + duration + '</td></tr>' +
            newSolutionRows;
        
    } else {
        newSolutionRows =
            '<tr><td>' + excercise + '</td><td>Hibás</td><td>Rossz eredmény: ' + current + '</td><td>' + duration + '</td></tr>' +
            newSolutionRows;
    }

    soltuionsBodyElement.innerHTML = newSolutionRows;
}

function updateMaximumValueName(newOperator) {
    let maxValueName = '';
    if (newOperator == '+') {
        maxValueName = 'összeg';
    } else if (newOperator == '-') {
        maxValueName = 'kisebbítendő';
    } else if (newOperator == '×') {
        maxValueName = 'szorzat';
    } else if (newOperator == ':') {
        maxValueName = 'osztandó';
    }

    let maxValueNameElement = document.getElementById('maxValueName');
    maxValueNameElement.innerHTML = maxValueName;
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}