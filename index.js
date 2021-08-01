const fs = require('fs');
const inquirer = require('inquirer');

const generatePage = require('./sc/test');

//Employees
const Employee = require('./lib/employee');
const Engineer = require('./lib/engineer');
const Intern = require('./lib/intern');
const Manager = require('./lib/manager');

//user answers
let engineerArr = [];
let managerArr = [];
let internArr = [];
let employeeArr = {engineerArr, managerArr, internArr};
//User questions
function promptUser(){
    return inquirer
    .prompt([
        {
            type: 'text',
            name: 'employee',
            message: "What is the employee's name? (Required!)",
            validate: employeeInput => {
                if (employeeInput) {
                    return true;
                }else {
                    console.log ("Please enter the employee's name.");
                    return false;
                }
            }
        },
        {
            type: 'text',
            name: 'id',
            message: "What is the employee's id? (Required!)",
            validate: idnInput => {
                if (idnInput) {
                    return true;
                }else {
                    console.log ("Please enter the employee's id.");
                    return false;
                }
            }
        },
        {
            type: 'text',
            name: 'email',
            message: "What is the employee's email? (Required!)",
            validate: emailInput => {
                if (emailInput) {
                    return true;
                }else {
                    console.log ("Please enter the employee's email.");
                    return false;
                }
            }
        },
        {
            type: 'list',
            name: 'rank',
            message: "What is the employee's rank in the company? (Use arrow keys!)",
            choices: ['Engineer', 'Manager', 'Intern']
        },
    ])
//Rank questions
    .then(({employee, id, email, rank}) => {
        if (rank === 'Manager'){
            return inquirer
            .prompt([
                {
                    type: 'text',
                    name: 'number',
                    message: "What is the Manager's number? (Required!)",
                    validate: numberInput => {
                        if (numberInput) {
                            return true;
                        } else {
                            console.log ("Please enter the Manager's number.");
                            return false;
                        }
                    }
                },
                {
                    type: 'confirm',
                    name: 'another',
                    message: 'Would you like to add another associate?'
                },
            ])
            .then(({number, another}) => {
                managerArr.push(new Manager(employee, id, email, number))
                if (another){
                    return promptUser();
                }
            })
        }else if (rank === 'Engineer') {
            return inquirer
                .prompt([
                {
                    type: 'text',
                    name: 'github',
                    message: "What is the Engineer's github? (Required!)",
                    validate: githubInput => {
                        if (githubInput) {
                            return true;
                        } else {
                            console.log ("Please enter the Engineer's github.");
                            return false;
                        }
                    }
                },
                {
                    type: 'confirm',
                    name: 'another',
                    message: 'Would you like to add another associate?'
                },
            ])
            .then(({github, another}) => {
                engineerArr.push(new Engineer(employee, id, email, github))
                if (another){
                    return promptUser();
                }
            })
        } else if (rank === 'Intern') {
            return inquirer
            .prompt([
                {
                    type: 'text',
                    name: 'school',
                    message: 'Where did or does your intern go to school? (Required!)',
                    validate: schInput => {
                        if(schInput){
                            return true;
                        } else {
                            console.log ('Please enter the school your intern went or attends.');
                            return false;
                        }
                    }
                },
                {
                    type: 'confirm',
                    name: 'another',
                    message: 'Would you like to add another associate?'
                },
            ])
            .then(({school, another}) => {
                internArr.push(new Intern(employee, id, email, school))
                if (another) {
                    return promptUser();
                }
            })
        }
    }) 
}

promptUser()
    .then(eD => {
        return generatePage(employeeArr)
    })
    .then (htmlFile =>{
        fs.writeFile('./dist/index.html', htmlFile, err=> {
            console.log('File was successfully created.')
            if(err){
                return;
            }
        })
    })