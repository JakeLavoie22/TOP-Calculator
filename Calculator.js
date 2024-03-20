// Front-End JS (In hind sight, should have been mostly  html )

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
        button.type = "button";                        // this is to avoid "form-filling" when button pressed 
        button.classList.add(buttonClass);            //add CSS class for each button element created 
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



///////////////////////////////////////////////////////////////////////////////////
// Back-end Logic : 



const numberBtns = allDigitInfo.filter((buttonInfo) => {   //filter out digit buttons from allDigitInfo
    if(buttonInfo.button.value !== "undefined" ){
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
const equalBtn = allDigitInfo[18].button; 

const operatorBtns = [plusBtn,  multiplyBtn, minusBtn, divideBtn, equalBtn];
const specialBtns = [factorialBtn, signChangeBtn]

let displayValue = 0;
let result = 0;
let opClicked = "false";

(function build(){

let a = "";   // first operand 
let b = "";   // second operand
let opClickCount = 0;    // number of times an operator was clicked, reset by  "=" and "A/C" buttons
let lastClick = "";     
let bClicked; 



numberBtns.forEach(buttonInfo => {                       
    buttonInfo.button.addEventListener('click', () => {
        bClicked = "false";  // this resets all the time. its only used for b operand coma ( line 193 )          

        if ((lastClick === "=") && (a.length <= 10)){     //Screen resets if "=" is pressed and a number is entered straight away, without an operator
            a = buttonInfo.button.value;   // resets screen and calculation 
            displayValue = a;
            lastClick = "a";
        }else if((lastClick === "" || lastClick === "a") && a.length <= 10){     //store numbers clicked into a operand
            a += buttonInfo.button.value;
            displayValue = a;
            lastClick = "a";
        } else if ((lastClick !== "a") && b.length <= 10){    //store numbers clicked into b operand
            bClicked = "true";
            b += buttonInfo.button.value;
            displayValue = b;
        };
    
        updateDisplay();        
    
        // if operator previously clicked, compute a and b calculation based on the operator lastClick, but don't update display it yet 
        if(opClickCount > 0 && lastClick !== a ){
            compute(a, b, lastClick);
            console.log("computed but not displayed yet");
        }  else {
            result = displayValue; 
        }; 
        console.log("a is now", a," type :", (typeof a),", b is ", b);
        console.log("you clicked ",buttonInfo.button.textContent ,"button, Display value is", displayValue, "actual result is ", result," ,result type:", (typeof result), );
        console.log("last click is ", lastClick, ",clickCount is ", opClickCount);

    });
});

resetBtn.addEventListener('click', () => {
    a = "";
    b = "";
    result = "";
    opClickCount = 0;
    lastClick = "=";
    displayValue = 0;
    updateDisplay();
    console.log("reset");
});

specialBtns.forEach(button =>{       // For "+/-" and "F!" buttons
    button.addEventListener('click', () => {  
        console.log(button.innerText);
    
        if(button.innerText === "+/-"){
            displayValue = -(Number(displayValue));  // reverse sign
        } else if (button.innerText === "F!"){
            displayValue = factorial(displayValue);
        };
    
        updateDisplay();    // Update display showing changes made to operand before computing a AND b based on lastClick 
        b = displayValue;
        compute(a, b, lastClick);
        console.log("display value is", displayValue, "actual result is ", result, "result type", (typeof result), ", a is now", a, ", b is ", b, ", last click is ", lastClick, "clickcount is ", opClickCount);
    });
});

operatorBtns.forEach(button=> {             // For "=, +, - , * and /" buttons. 
    button.addEventListener('click', () => {
        // "="
        if(button.innerText === "="){    
            console.log("=");
            a = displayValue;  
            opClickCount = 0;   // resets operator click count 
            console.log("displayValue is, ",displayValue, ",result is ", result, "a is now ", a,", b is now ", b, "lastClick: ", lastClick , "times clicked; ", "clickcount ;", opClickCount );
        // +, - , * and /
        } else {                      
             opClickCount ++;
             a = result;
             console.log(lastClick, " is last click, ", "a is ",a, ", result is: ", a);
        };
        b = "";
        displayValue = result.toString();
        updateDisplay();
        lastClick = button.innerText;
    });
});

comaBtn.addEventListener('click', () => {
    a = a.toString();
    b = b.toString();
    if (!a.includes(".") && lastClick === "a"){ 
        a += ".";
        displayValue = a;
    } else if (!b.includes(".") && bClicked === "true"){  
        b += ".";
        displayValue = b;
    }; 
    console.log(". clicked, b is now", b,", a is now", a );
    updateDisplay();
});

})();



//////////////////// FUNCTIONS : 

function updateDisplay() {
    const display = document.querySelector(".screenBody");
    display.innerText = rounded(displayValue);
};


function factorial(num){ 
    if (num === 0){
        return 1;
      } else {
        // I have to pre-declare fact = 1, otherwise I wont be able to access the variable in order to return it higher up  
        let fact = 1;                  
        for(let i = 1 ; i <= num ; i++){
          fact *= i;
        };
        return fact;
      };
};
             

function compute (a, b, lastClick){
    a = Number(a);
    b = Number(b);
    if(lastClick === "+" ){
        result = a + b; 
        lastClick = "+";
    } else if(lastClick === "*"){
        console.log("*");
        result = a * b;
        lastClick = "*";
    } else if (lastClick === "-"){
        console.log("-");
        result = a - b;
        lastClick = "-";
    } else if (lastClick === "/"){
        console.log("/");
        result = a / b;
        lastClick = "/";
    } else {
        result = displayValue;
    };
};


function rounded(strResult){
    if (strResult.toString().length > 11){
       strResult = Number(strResult).toExponential();
       strResult = Number(strResult).toPrecision(5);
    };
    return strResult;
};




/*
Its the number input button that computes the calculation based on previous operator input 
If b is 0, don't compute yet and result = a 
if b is entered , a exists
a is the first number input 
b is the second number input

whether I press "=" or "any other operator", update last click and displayed value( which is the result previously calculated when a or b entered.)

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