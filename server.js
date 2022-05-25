//const express = require("express");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const Choice = require("inquirer/lib/objects/choice");
//require("dotenv").config();
//console.log(process.env);

//create connect ot database
const connection = mysql.createConnection(
  //   process.env.DB_NAME,
  //   process.env.DB_USER,
  //   process.env.DB_PASSWORD,
  {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "CandyApple54321!",
  }
);

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
      }
    });
};

startingPrompt();
