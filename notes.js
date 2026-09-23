for (let i = 0; i < 10; i++) {
  console.log("Added to wishlist");
}

const a = 3;
const b = 4;

if (a === b) {
  console.log("Numbes are equal");
} else if (a > b) {
  console.log("a is greater than b");
} else {
  console.log("b is greater than a");
}

let users = ["Ram", "Shyam", "Hari", "Gita", "Sita"];

for (const user of users) {
  console.log(`Hello ${user}!`);
}
console.log(users.length);

class LoginPages {
  // This is a class.
  a = 20;

  constructor() {
    this.name = "John"; //This is a constructor. It is a special method that is called when an instance of the class is created. It is used to initialize the object.
    this.age = 30;
    this.company = "Google"; // This is a property of the class. It is used to store data related to the object.
  }

  login() {
    console.log("Login method called"); // This is a method inside the class.and method is a function that is associated with an object or class. It defines the behavior or actions that the object can perform.
  }
  sayHello() {}
}
// constructor is a special method in a class that is used to initialize objects of that class. It is called automatically when an instance of the class is created. The constructor can take parameters to set initial values for the object's properties.

const loginPageObject = new LoginPages("Google");
console.log(loginPageObject.company);
loginPageObject.login();

class LoginPage {
  a = 20;

  constructor(company) {
    this.name = "John";
    this.age = 30;
    this.company = company; // now it uses whatever you pass in
  }

  login() {
    console.log("Login method called");
  }
  sayHello() {}
}

const loginPageObject2 = new LoginPage("YouTube");
console.log(loginPageObject2.company);
loginPageObject2.login();

export default class PracticeImportExport {
  learn() {
    console.log("Learning import and export");
  }
}

const value = "Testing";
const string = "This is a string with a single quote";
+value; // concatenation of strings and variables
const string2 = `This is a string with a backtick and a variable: ${value}`; // template literal
console.log(string2);
console.log(string);

const names = ["John", "Anna", "Bob", "David"];
const sortedNames = [...names].sort((a, b) => a.localeCompare(b));
console.log(sortedNames);
