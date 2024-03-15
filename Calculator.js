// Front-End JS 

const allDigitInfo = [];                 //Buttons are pushed to this array in "calcButtonsGenerator"
const extraButtonInfo = [               // The info from this array is pushed to the buttons objects in "pushInfoToButtons"
    {btnText: "AC", row: 1},
    {btnText: "+/-", row: 1},
    {btnText:"F!", row: 1},
    {btnText: "/", row: 1},
    {btnText: "7", row: 2, btnValue: 7},
    {btnText: "8", row: 2, btnValue: 8},
    {btnText: "9", row: 2, btnValue: 9},
    {btnText: "*", row: 2},
    {btnText: "4", row: 3, btnValue: 4},
    {btnText: "5", row: 3, btnValue: 5},
    {btnText: "6", row: 3, btnValue: 6},
    {btnText: "-", row: 3},
    {btnText: "1", row: 4, btnValue: 1},
    {btnText: "2", row: 4, btnValue: 2},
    {btnText: "3", row: 4, btnValue: 3},
    {btnText: "+", row: 4},
    {btnText: "0", row: 5, btnValue: 0, btnId: "zero"},
    {btnText: ".", row: 5},
    {btnText: "=", row: 5},
];

const calcButtonsGenerator = (function() {                        // Main function that generates the calculator button elements
    const buttonsBody = document.querySelector(".buttonsBody");
    const numberOfRows = 3;

    generateButton(4, "opButtonClass", buttonsBody); // first row : special buttons

    for(let i = 1; i <= numberOfRows; i++) {
        generateButton(3, "calcButtonClass", buttonsBody);     // 3 rows of numbers with 1 operator at the end
        generateButton(1, "opButtonClass", buttonsBody);      //the operator at end of each numbers row
    };

    generateButton(2, "calcButtonClass", buttonsBody);     // last row 
    generateButton(1, "opButtonClass", buttonsBody);      // last operator on last row 

})();

function generateButton(number, buttonClass, buttonsBody){ // buttonsBody constant is defined in IIFE function line 27, need to add it as third parameter in order to access outside it the function 
    for (let i = 1; i <= number; i++) {
        let button = document.createElement("button");  
        button.type = "button";    // this is to avoid "form-filling" when button pressed 
        button.classList.add(buttonClass);     //add CSS class for each button element created 
        buttonsBody.appendChild(button);
        allDigitInfo.push({button});
    };
};

const totalButtons = allDigitInfo.length;  // number of buttons is the length of the allDigitInfo array 

(function pushInfoToButtons(allDigitInfo, extraButtonInfo){      // Add styling, value and text to each button from the allDigitInfo array
    for(let i= 0; i < totalButtons; i++){
        allDigitInfo[i].button.id = extraButtonInfo[i].btnId;
        allDigitInfo[i].button.value = extraButtonInfo[i].btnValue
        allDigitInfo[i].button.textContent = extraButtonInfo[i].btnText; 
    };
})(allDigitInfo, extraButtonInfo);
//console.table(extraButtonInfo);


///////////////////////////////////////////////////////////////////////////////////
// Back-end Logic : 




const numberBtns = allDigitInfo.filter((buttonInfo) => {   //filter out digit buttons from allDigitInfo
    if(buttonInfo.button.value !== "undefined" ){
        return true;
    }
});


const workBtns = allDigitInfo.filter((buttonInfo) => {   //filter out the work buttons from allDigitInfo 
    if(buttonInfo.button.value == "undefined" && buttonInfo.button.textContent !== "."){
        return true;
    }
});


const resetBtn = allDigitInfo[0].button;
const signChangeBtn = allDigitInfo[1].button;
const factorialBtn = allDigitInfo[2].button;
const divideBtn = allDigitInfo[3].button;
const multiplyBtn = allDigitInfo[7].button;
const minusBtn = allDigitInfo[11].button;
const plusBtn = allDigitInfo[15].button;
const comaBtn = allDigitInfo[17].button;

comaBtn.value = ".";
const equalBtn = allDigitInfo[18].button; 

const operatorBtns = [plusBtn,  multiplyBtn, minusBtn, divideBtn];

let displayValue = 0;

let result = 0;


(function build(){

let opClicked = "false"; //no operator button has been clicked yet 
let a = "";  
let b = ""; 
let opClickCount = 0;
let lastClick = "=";
let currentClick;

function updateDisplay() {
    const display = document.querySelector(".screenBody");
    display.innerText = displayValue;
    if(displayValue.length > 9) {
        display.innerText = displayValue.substring(0, 9);
        console.log(displayValue.substring(0, 9));
    };
};

numberBtns.forEach(buttonInfo => {                       
    buttonInfo.button.addEventListener('click', () => {


    if(lastClick === "=" || lastClick === "a"){
        a += buttonInfo.button.value;
        displayValue = a;
        lastClick = "a";
        console.log("a value: ", a, ",last Click is ", lastClick, ", currentClick is ", currentClick);

    } else if (lastClick !== "a") {
        b += buttonInfo.button.value;
        displayValue = b;
        console.log("b value: ", b, ",last Click", lastClick);
    };

    updateDisplay();

    if(opClickCount > 0 && lastClick !== a ){
        console.log("computed");
        if(lastClick === "+" ){
            result = Number(a) + Number(b);
            lastClick = "+";
        } else if(lastClick === "*"){
            console.log("*");
            result = Number(a) * Number(b);
            lastClick = "*";
        } else if (lastClick === "-"){
            console.log("-");
            result = Number(a) - Number(b);
            lastClick = "-";
        } else if (lastClick === "/"){
            if ( b === 0 ){
                displayValue = "ERROR"
            };
            console.log("/");
            result = Number(a) / Number(b);
            lastClick = "/";
        };
    }  else {
        result = displayValue;
    };
    console.log("display value is", displayValue, "actual result is ", result, ", a is now", a, ", b is ", b, ", last click is ", lastClick, "clickcount is ", opClickCount);

        });
    });



comaBtn.addEventListener('click', () => {
    a.toString();
    b.toString();
    if (!a.includes(".")){   // removed && a != ""
        a += comaBtn.value;
        displayValue = a;
    } if (!b.includes(".")){   // removed  && b != ""
        b += comaBtn.value;
        displayValue = b;
    }; 
    updateDisplay();
});

resetBtn.addEventListener('click', () => {
    a = "";
    b = "";
    result = "";
    opClickCount = 0;
    lastClick = "=";
    displayValue = 0;
    currentClick = "";
    console.log("reset");
    updateDisplay();
})

operatorBtns.forEach(button=> {
    button.addEventListener('click', () => {
        opClickCount ++;
        a = result;
        b = "";
        displayValue = result.toString();
        updateDisplay();
        console.log("a is ",a, ", result is: ", a, "last click is ", lastClick);
    });
});

equalBtn.addEventListener('click', () => {
    console.log("=");
    displayValue = result.toString();
    a = displayValue;
    b = "";
    opClickCount = 0;
    updateDisplay();
    lastClick = "=";
    currentClick = "";
    console.log("displayValue is, ",displayValue, ",result is ", result, "a is now ", a,", b is now ", b, "lastClick: ", lastClick , "times clicked; ", opClickCount );

}); 

plusBtn.addEventListener('click', () => {
    lastClick = "+";
    console.log("+");
});

multiplyBtn.addEventListener('click', () => {
    lastClick = "*";
    console.log("*");
});

minusBtn.addEventListener('click', () => {
    lastClick = "-";
    console.log("-");
});

divideBtn.addEventListener('click', () => {
    lastClick = "/";
    console.log("/");
});

factorialBtn.addEventListener('click', () => {
    console.log("F!");
    displayValue = factorial(displayValue);
    updateDisplay();
    b = displayValue;
            if(lastClick === "+" ){
                result = Number(a) + Number(b);
                lastClick = "+";
            } else if(lastClick === "*"){
                console.log("*");
                result = Number(a) * Number(b);
                lastClick = "*";
            } else if (lastClick === "-"){
                console.log("-");
                result = Number(a) - Number(b);
                lastClick = "-";
            } else if (lastClick === "/"){
                if ( b === 0 ){
                    displayValue = "ERROR"
                };
                console.log("/");
                result = Number(a) / Number(b);
                lastClick = "/";
            } else {
                result = displayValue;
            };
    console.log("display value is", displayValue, "actual result is ", result, ", a is now", a, ", b is ", b, ", last click is ", lastClick, "clickcount is ", opClickCount);
    
});


signChangeBtn.addEventListener('click', () => {
    console.log("+/-");
    displayValue = -(Number(displayValue));
    updateDisplay();
    b = displayValue;
            if(lastClick === "+" ){
                result = Number(a) + Number(b);
                lastClick = "+";
            } else if(lastClick === "*"){
                console.log("*");
                result = Number(a) * Number(b);
                lastClick = "*";
            } else if (lastClick === "-"){
                console.log("-");
                result = Number(a) - Number(b);
                lastClick = "-";
            } else if (lastClick === "/"){
                if ( b === 0 ){
                    displayValue = "ERROR"
                };
                console.log("/");
                result = Number(a) / Number(b);
                lastClick = "/";
            } else {
                result = displayValue;
            };
    console.log("display value is", displayValue, "actual result is ", result, ", a is now", a, ", b is ", b, ", last click is ", lastClick, "clickcount is ", opClickCount);
    
});




})();


function factorial(num){
    if (num === 0){
        return 1;
      } else {
        let fact = 1;                  // I have to predetermine fact = 1, otherwise I wont be able to access the variable in order to return it higher up  
        for(let i = 1 ; i <= num ; i++){
          fact *= i;
        };
        return fact;
      };
};


function compute (){
    if(lastClick === "+" ){
        result = Number(a) + Number(b);
        lastClick = "+";
    } else if(lastClick === "*"){
        console.log("*");
        result = Number(a) * Number(b);
        lastClick = "*";
    } else if (lastClick === "-"){
        console.log("-");
        result = Number(a) - Number(b);
        lastClick = "-";
    } else if (lastClick === "/"){
        if ( b === 0 ){
            displayValue = "ERROR"
        };
        console.log("/");
        result = Number(a) / Number(b);
        lastClick = "/";
    };
};






/* // coma button code :  comaBtn.addEventListener('click', () =>{  //Refuse "." entry more than once. 
        b += comaBtn.textContent;
        comaBtn.disabled = true; 
        let comaClicked = true;
        console.log(b);
        screenBody.textContent = b;
    });
    result.push(b); */ 



/*
a is the first number input 
b is the second number input

whether I press "=" or "any other operator", compute the a and b calculation and update the a variable

do I store input digits in a string or an array ? 

 directly after any operator ( +, * , - , /) => compute the entered number by itself. 
If "AC" pressed, reset calculator memory 
If +/- pressed, change number sign 
add a factorial button , number (a) has to be entered before factorial is pressed and thus computed
if * or / operator entered before number => reset 
if + pressed before number, do nothing 
if - pressed before number, change sign. 
If "0" is pressed, it has to be followed by "." in order to further press 0 
if "." is pressed, consider "0." 
*/