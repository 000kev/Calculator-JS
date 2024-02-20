const numberBtns = document.querySelectorAll("#Number");

const equals_button = document.getElementById("equals");
const clear_button = document.getElementById("clear");
const backspace_button = document.getElementById("backspace");
const multiply_button = document.getElementById("multiply");
const add_button = document.getElementById("add");
const divide_button = document.getElementById("divide");
const subtract_button = document.getElementById("subtract");
const operator_array = [
  equals_button, clear_button, backspace_button, 
  multiply_button, add_button, divide_button, subtract_button
];

const operation = document.querySelector("input");
const result = document.getElementById("result");

let numberStack = [];
let operatorStack = [];
let number = "";
let answer = 0;

const numberKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
const operatorKeys = ["-", "+", "*", "/", "Enter", "=", "Backspace"];

function addNumbers(num1, num2) {
  if (!isNaN(num1) && !isNaN(num2)) {
    return num1 + num2;
  } else {
    return "ERROR";
  }
}

function subNumbers(num1, num2) {
  if (!isNaN(num1) && !isNaN(num2)) {
    return num1 - num2;
  } else {
    return "ERROR";
  }
}

function mulNumbers(num1, num2) {
  if (!isNaN(num1) && !isNaN(num2)) {
    return num1 * num2;
  } else {
    return "ERROR";
  }
}

function divNumbers(num1, num2) {
  if (!isNaN(num1) && !isNaN(num2)) {
    if (num2 == 0) {
      alert("The secrets to the universe won't be found by breaking this humble calculator, young Jedi. The calculator will now be reset at 0");
      return 0;
    } else return num1 / num2;
  } else {
    return "ERROR";
  }
}

const operate = (arr, operator) => {
  switch (operator) {
    case "+":
      return addNumbers(arr.shift(), arr.shift());
      break;

    case "*":
      return mulNumbers(arr.shift(), arr.shift());
      break;

    case "/":
      return divNumbers(arr.shift(), arr.shift());
      break;

    case "-":
      return subNumbers(arr.shift(), arr.shift());
      break;
    case "=":
    case "Enter":
      return answer;
      break;
  }
};

const clear = () => {
  answer = 0;
  number = "";
  numberStack = [];
  operatorStack = [];
  displayActiveOperator("Enter");
};

const backspace = () => {
  const temp = number.split('');
  temp.splice(-1,1);
  number = temp.join('');
}

const calculate = (terminate) => {

  if (!terminate) {
    for (let i = 0; i < operatorStack.length; i++) {
      answer = operate(numberStack, operatorStack.shift());
      displayOutput(answer);
      numberStack.push(answer);
    }
  } else {
    answer = operate(numberStack, operatorStack.shift());
    displayOutput(answer);
    numberStack.push(answer);
  }
};

const displayInput = () => {
  operation.value = number;
};

const displayOutput = (answer) => {
  if (answer !== undefined) {
    if (answer % 1 !== 0) answer = answer.toFixed(6);
    else result.innerText = answer;
  } else {
    result.innerText = '';
  }
  answer!==undefined ? result.innerText = answer : result.innerText = '';
};

const displayActiveOperator = (operator) => {
  operator_array.forEach( (element) => {
    // console.log(operator, element.value === operator);
    if (operator === "=" || operator === "Enter") element.classList.remove("active")
    else element.value === operator ? element.classList.add("active") : element.classList.remove("active");
  })
};

const constructNumber = (n) => {
  if (numberKeys.indexOf(n) > -1) return true;
  else return false;
};

const inputRules = (key) => {

  if (numberKeys.indexOf(key) > -1 || operatorKeys.indexOf(key) > -1) {
    if (!constructNumber(key)) {
      if (
        numberStack.length == 0 &&
        operatorStack.length > numberStack.length &&
        number !== ""
      ) {
        let first_op = operate([0, parseFloat(number)], operatorStack.shift());
        numberStack.push(first_op);
        number = "";
      }
      if (key === "=" || key === "Enter") {
        if (number !== "") {
          numberStack.push(parseFloat(number));
          number = "";
        }
        displayActiveOperator(key);
        calculate(true);
      } else if (key === "Backspace") {
        backspace();
      } else {
        if (operatorStack.length > 0 && number !== "") {
          numberStack.push(parseFloat(number));
          number = "";
          operatorStack.push(key);

          displayActiveOperator(key);
        } else {
          if (number !== "" && parseFloat(number) > 0) {
            numberStack.push(parseFloat(number));
            number = "";
          }
          if (
            number === "" &&
            numberStack.length === 0 &&
            (key === "*") | (key === "/") | (key === "+")
          ) {
          } else if (operatorStack.length == numberStack.length) {
            operatorStack.splice(-1, 1, key);
            displayActiveOperator(operatorStack.slice(-1)[0]);
          } else {
            operatorStack.push(key);
            displayActiveOperator(key);
          }
        }
      }
    } else {
      number.indexOf(".") > -1 && key === "."
        ? (number = number)
        : (number += key);
    }
  }
};

const initialiseKeyboardHandler = () => {
  document.onkeydown = (e) => {
    displayInput(inputRules(e.key));
    if (numberStack.length > 1) calculate(false);
  };
};

const initialiseButtonHandler = () => {

  numberBtns.forEach( (button) => {
    button.addEventListener("click", () => displayInput(inputRules(button.value)));
  })

  operator_array.forEach( (element) => {
    if (element !== null && (element.value === "Backspace" || element.value === "="))  {
      element.addEventListener("click", () => {
        displayInput(inputRules(element.value))
      })
    }
    else if (element !== null && (element.value == "Clear")) {
      element.addEventListener("click", () => {
        displayInput(clear());
        displayOutput();
      })
    } 
    else {
      element.addEventListener("click", () => {
        displayInput(inputRules(element.value));
        if (numberStack.length > 1) calculate(false);
      });
    }
  });
};

const main = () => {
  initialiseKeyboardHandler();
  initialiseButtonHandler();
};

main();
