
const allDigitInfo = [];
const extraButtonInfo = [
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

const calcButtonsGenerator = (function() {
    const buttonsBody = document.querySelector(".buttonsBody");
    const numberOfNumButtons = 3;
    const numberOfRows = 3;


    generateButton(4, "opButtonClass", buttonsBody); // first row : special buttons

    for(let i = 1; i <= numberOfRows; i++) {

        generateButton(3, "calcButtonClass", buttonsBody);  // 3 rows of numbers with 1 operator at the end
        generateButton(1, "opButtonClass", buttonsBody); //the operator at end
    };

    generateButton(2, "calcButtonClass", buttonsBody); // last row 
    generateButton(1, "opButtonClass", buttonsBody);  // last operator on last row 

})();


function generateButton(number, buttonClass, buttonsBody){ // buttonsBody constant is defined in IIFE function line 16, need to add it as third parameter in order to access outside it the function 
    for (let i = 1; i <= number; i++) {
        let button = document.createElement("button");  
        button.type = "button";    // this is to avoid "form-filling" when button pressed 
        button.classList.add(buttonClass);     //add CSS class for each button element created 
        buttonsBody.appendChild(button);
        allDigitInfo.push({button});
    };
};


const totalButtons = allDigitInfo.length;


console.log("total Buttons", totalButtons);


(function pushInfoToButtons(allDigitInfo, extraButtonInfo){
    for(let i= 0; i < totalButtons; i++){
        allDigitInfo[i].button.id = extraButtonInfo[i].btnId;
        allDigitInfo[i].button.value = extraButtonInfo[i].btnValue
        allDigitInfo[i].button.textContent = extraButtonInfo[i].btnText; 
    };
console.table(allDigitInfo);

})(allDigitInfo, extraButtonInfo);






// Logic : Number input test :
//Here, in order to access each object key in the array of objects "allDigitInfo", I need to extract "arrayDigitValue" with a list of values for each digit button.

//I need to build a function with an adeventlistener for a and one for b. In both a and b functions, I cant add more than one "." (Error or just deactivate "=" button ?)
// then call those a and b functions in a "compute " function
// In compute, I'll also call the following functions with conditions:  addNumbers, subtractNumbers, multiplyNumbers, divideNumbers

/*let a = "";
let b = "";

allDigitInfo.digitButton.addEventListener("click", addToA);
    function addToA(){
        a += allDigitInfo.value;
        console.log(a)
    };

  


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