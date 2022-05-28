//const express = require("express");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const Choice = require("inquirer/lib/objects/choice");
const { response } = require("express");
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
        case "Add a department":
          addDepartment();
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

function viewRoles() {
  const roles = `SELECT roles.*, department.dept_name
  FROM roles 
  LEFT JOIN department ON roles.department_id = department.id `;

  connection.query(roles, (err, rows) => {
    if (err) {
      throw err;
    }
    console.table(rows);
    startingPrompt();
  });
}

function viewEmployees() {}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "departmentName",
        message: "Please enter the name of the new department",
      },
    ])
    .then(function (answer) {
      //console.log(answer);
      const deptObject = {
        dept_name: answer.departmentName,
      };
      const insertDepartment = `INSERT INTO department SET ?`;
      connection
        .promise()
        .query(insertDepartment, deptObject)
        .then(([response]) => {
          if (response.affectedRows > 0) {
            viewDepartments();
          } else {
            console.info("failed to add to databse");
            startingPrompt();
          }
        });
    });
}

async function addRole() {
  var [departments] = await connection
    .promise()
    .query("SELECT * FROM department");
  var departmentArray = departments.map(({ id, dept_name }) => ({
    name: dept_name,
    value: id,
  }));
  // console.log(departmentArray);
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What is the title of the new role?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of the new role?",
      },
      {
        type: "list",
        name: "department",
        message: "Please select the department for the new role?",
        choices: departmentArray,
      },
    ])
    .then(function (answers) {
      var roleObject = {
        title: answers.title,
        salary: answers.salary,
        department_id: answers.department,
      };
      const insertRole = `INSERT INTO roles SET ?`;
      connection
        .promise()
        .query(insertRole, roleObject)
        .then(([response]) => {
          if (response.affectedRows > 0) {
            viewRoles();
          } else {
            console.info("failed to add to database");
            startingPrompt();
          }
        });
    });

  //  const insertEmployee = `INSERT INTO`
  //  const insertDepartment = `INSERT INTO`

  // connection.query(insertRole, (err, rows) => {
  //   if (err) {
  //     throw err;
  //   }
  //   console.table(rows);
  //   startingPrompt();
  // });
}

function addEmployee() {}

function UpdateEmployee() {}
