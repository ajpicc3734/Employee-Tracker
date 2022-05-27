//const express = require("express");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const Choice = require("inquirer/lib/objects/choice");
require("dotenv").config();
//console.log(process.env);

//create connect ot database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const startingPrompt = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "startingPrompt",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
        ],
      },
    ])
    .then((userChoice) => {
      switch (userChoice.startingPrompt) {
        case "View all departments":
          viewDepartments();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "View all employees":
          viewEmployees();
          break;
        case "View a department":
          viewSingleDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee":
          UpdateEmployee();
          break;
      }
    });
};

startingPrompt();

function viewDepartments() {
  const dept = `SELECT * FROM department`;

  connection.query(dept, (err, rows) => {
    if (err) {
      throw err;
    }
    console.table(rows);
    startingPrompt();
  });
}
