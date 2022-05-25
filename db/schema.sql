DROP DATABASE IF EXISTS employee_tracker;
DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS employee;

CREATE DATABASE employee_tracker;

USE employee_tracker;

CREATE TABLE department (
    id INTEGER AUTO_INCREMENT   PRIMARY KEY,
    dept_name VARCHAR(30)
);

CREATE TABLE roles (
    id INTEGER AUTO_INCREMENT   PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INTEGER

);

CREATE TABLE employee (
    id INTEGER AUTO_INCREMENT   PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER
   -- manager_id INTEGER FOREIGN KEY REFERENCES

);