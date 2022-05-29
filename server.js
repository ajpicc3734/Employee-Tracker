const mysql = require("mysql2");
const inquirer = require("inquirer");
const Choice = require("inquirer/lib/objects/choice");
const { response } = require("express");
const e = require("express");
require("dotenv").config();

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
          "Update an employee",
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
          updateEmployee();
          break;
        default:
          console.log("Sorry, unknown request");
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

function viewEmployees() {
  const employee = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, roles.salary, department.dept_name, employee.manager_id 
  FROM employee
  LEFT JOIN roles ON employee.roles_id = roles.id
  LEFT JOIN department ON department.id = roles.department_id`;

  connection.query(employee, (err, rows) => {
    if (err) {
      throw err;
    }
    console.table(rows);
    startingPrompt();
  });
}

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
}

async function addEmployee() {
  var [role] = await connection.promise().query("SELECT * FROM roles");
  var rolesArray = role.map(({ id, title }) => ({
    name: title,
    value: id,
  }));

  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the first name of the employee?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the last name of the employee?",
      },
      {
        type: "list",
        name: "role",
        message: "Please select the role of the new employee",
        choices: rolesArray,
      },
      {
        type: "input",
        name: "manager",
        message: "Who is the manager of the employee?",
      },
    ])
    .then(function (answers) {
      var employeeObject = {
        first_name: answers.firstName,
        last_name: answers.lastName,
        roles_id: answers.role,
      };
      const insertEmployee = `INSERT INTO employee SET ?`;
      connection
        .promise()
        .query(insertEmployee, employeeObject)
        .then(([response]) => {
          if (response.affectedRows > 0) {
            viewEmployees();
          } else {
            console.info("failed to add to database");
            startingPrompt();
          }
        });
    });
}

async function updateEmployee() {
  var [employee] = await connection.promise().query("SELECT * FROM employee");
  var employeeArray = employee.map(({ first_name, id }) => ({
    name: first_name,
    value: id,
  }));

  var [role] = await connection.promise().query("SELECT * FROM roles");
  var roleArray = role.map(({ id, title }) => ({
    name: title,
    value: id,
  }));

  inquirer
    .prompt([
      {
        type: "list",
        name: "roles",
        message: "Select the new employee role",
        choices: roleArray,
      },
      {
        type: "list",
        name: "employees",
        message: "Select the employee you would like to update",
        choices: employeeArray,
      },
    ])
    .then(function (answers) {
      var query = `UPDATE employee SET roles_id = ? WHERE id = ?`;
      connection.query(
        query,
        [answers.roles, answers.employees],
        function (err, res) {
          if (res.affectedRows > 0) {
            viewEmployees();
          } else {
            throw err;
          }
        }
      );
    });
}
