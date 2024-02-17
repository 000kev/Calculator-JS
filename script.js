const numberBtns = document.querySelectorAll("#Number");

const equals_button = document.getElementById("equals");
const clear_button = document.getElementById("clear");
const backspace_button = document.getElementById("backspace");
const multiply_button = document.getElementById("multiply");
const add_button = document.getElementById("add");
const divide_button = document.getElementById("divide");
const subtract_button = document.getElementById("subtract");
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
// Function that returns the answer based on the array of values provided and the operator
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
  console.log("Calculate the answer!");

  if (!terminate) {
    for (let i = 0; i < operatorStack.length; i++) {
      answer = operate(numberStack, operatorStack.shift());
      displayOutput(answer);
      numberStack.push(answer);
    }
    console.log("Don't terminate. Update the answer");
  } else {
    console.log("Terminate. Update the answer");
    answer = operate(numberStack, operatorStack.shift());
    displayOutput(answer);
    numberStack.push(answer);
  }
};

const displayInput = () => {
  operation.value = number;
};

const displayOutput = (answer) => {
  answer!==undefined ? result.innerText = answer : result.innerText = '';
};

const displayActiveOperator = (operator) => {
  switch (operator) {
    case "+":
      add_button.classList.add("active");
      subtract_button.classList.remove("active");
      multiply_button.classList.remove("active");
      divide_button.classList.remove("active");
      break;
    case "*":
      add_button.classList.remove("active");
      subtract_button.classList.remove("active");
      multiply_button.classList.add("active");
      divide_button.classList.remove("active");
      break;
    case "-":
      add_button.classList.remove("active");
      subtract_button.classList.add("active");
      multiply_button.classList.remove("active");
      divide_button.classList.remove("active");
      break;
    case "/":
      add_button.classList.remove("active");
      subtract_button.classList.remove("active");
      multiply_button.classList.remove("active");
      divide_button.classList.add("active");
      break;
    case "=":
    case "Enter":
      add_button.classList.remove("active");
      subtract_button.classList.remove("active");
      multiply_button.classList.remove("active");
      divide_button.classList.remove("active");
  }
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
        // IF THE OPERATOR IS ENTER
        if (number !== "") {
          numberStack.push(parseFloat(number));
          number = "";
        }
        displayActiveOperator(key);
        calculate(true);
      } else if (key === "Backspace") {
        // IF THE OPERATOR IS BACKSPACE
        backspace();
      } else {
        // IF ANY OTHER OPERATION IS USED
        if (operatorStack.length > 0 && number !== "") {
          console.log("You need to input a digit next!");
          numberStack.push(parseFloat(number));
          number = "";
          operatorStack.push(key);

          console.log(key);
          displayActiveOperator(key);
        } else {
          // console.log("Operator/number handling", numberStack, operatorStack, '\n', "Number:", number, '\n', "Key:", key);
          // EDGE CASE
          if (number !== "" && parseFloat(number) > 0) {
            numberStack.push(parseFloat(number));
            number = "";
          }
          // console.log("operatorStack vs numberStack length", operatorStack.length, numberStack.length);
          // OPERATOR RULE 1 - YOU CAN'T START WITH *, / OR +
          // OPERATOR RULE 2 - YOU MUST OVERWRITE OPERATORS INSTEAD OF ADDING TOO MANY
          if (
            number === "" &&
            numberStack.length === 0 &&
            (key === "*") | (key === "/") | (key === "+")
          ) {
            console.log("No operators as first input");
          } else if (operatorStack.length == numberStack.length) {
            console.log("More operators than numbers!");
            operatorStack.splice(-1, 1, key);
            console.log(operatorStack.slice(-1)[0]);
            displayActiveOperator(operatorStack.slice(-1)[0]);
          } else {
            operatorStack.push(key);
            console.log(key);
            displayActiveOperator(key);
          }
        }
      }
    } else {
      // else keep constructing the number
      // if logic on the number variable
      // number += key;
      number.indexOf(".") > -1 && key === "."
        ? (number = number)
        : (number += key);
      // if (number.indexOf(".") > -1 && key === ".") {
      //   number = number;
      // }
      // else {
      //   number += key;
      // }
    }
  }
};

const initialiseKeyboardHandler = () => {
  //Getting Input from the keyboard
  document.onkeydown = (e) => {
    displayInput(inputRules(e.key));
    if (numberStack.length > 1) calculate(false);
  };
};

const initialiseButtonHandler = () => {

  // numberBtns.forEach((button) => {
  //   button.addEventListener("click", () => {
  //     operation.value += button.innerText;
  //   });
  // });
  numberBtns.forEach( (button) => {
    button.addEventListener("click", () => displayInput(inputRules(button.value)));
  })
  
  add_button.addEventListener("click", () => {
    displayInput(inputRules(add_button.value));
    if (numberStack.length > 1) calculate(false);
  });
  subtract_button.addEventListener("click", () => {
    displayInput(inputRules(subtract_button.value));
    if (numberStack.length > 1) calculate(false);
  });
  multiply_button.addEventListener("click", () => {
    displayInput(inputRules(multiply_button.value));
    if (numberStack.length > 1) calculate(false);
  });
  divide_button.addEventListener("click", () => {
    displayInput(inputRules(divide_button.value));
    if (numberStack.length > 1) calculate(false);
  });
  backspace_button.addEventListener("click", () => {
    displayInput(inputRules(backspace_button.value));
  });
  clear_button.addEventListener("click", () => {
    displayInput(clear());
    displayOutput();
  });
  equals_button.addEventListener("click", () => {
    displayInput(inputRules(equals_button.value));
  });

  //adding event handlers for the operator buttons
  // operators.forEach((button) => {
  //   button.addEventListener("click", () => {
  //     if (!button.innerText.includes("Clear")) {
  //       //added spaces between the operators and numbers so i can split the input into an array
  //       operation.value += " " + button.innerText + " ";
  //       let numbersArr = operation.value.split(" ");
  //       // Splice the array so that we now have an array for the operator and another array for the numbers
  //       let operatorsArr = numbersArr.splice(1, 1);
  //       if (numbersArr.length > 2) {
  //         // use operate function to do the calculation based on the operator in the operator array
  //         operation.value = operate(numbersArr, operatorsArr[0]);
  //         if (!button.innerText.includes("=")) {
  //           operation.value += " " + button.innerText + " ";
  //         } else console.log("A");
  //       } else console.log("B");
  //       numbersArr.length = 0;
  //       operatorsArr.length = 0;
  //     }
  //   });
  // });
};

//<------------ all of this code should be in their own functions so we need to rework this logic ------------>//

const main = () => {
  initialiseKeyboardHandler();
  initialiseButtonHandler();
};

main();
