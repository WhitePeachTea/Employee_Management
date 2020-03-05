DROP DATABASE IF EXISTS employeeDB;

CREATE DATABASE employeeDB;

USE employeeDB;

CREATE TABLE department (
id int not null auto_increment,
name varchar(30),
primary key(id)
);

CREATE TABLE role (
id int not null auto_increment,
title varchar(30),
salary decimal default 0.0,
department_id int,
primary key(id)
);

CREATE TABLE employee (
id int not null auto_increment,
first_name varchar(30) not null,
last_name varchar(30) not null,
role_id int,
manager_id int,
primary key(id)
);

INSERT INTO department (name)
VALUES ('Sales'), ('Finance'), ('Engineering'), ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES 
    ('Sales Lead', 100000, 1),
    ('Salesperson', 80000, 1),
    ('Accountant', 125000, 2),
    ('Software Engineer', 120000, 3),
    ('Lead Engineer', 150000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Lawyer', 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, 5),
    ('Mike', 'Chan', 2, 1),
    ('Malia', 'Brown', 3, NULL),
    ('Kevin', 'Tupik', 4, 5),
    ('Ashley', 'Alice', 5, NULL),
    ('Sarah', 'Lourd', 6, NULL),
    ('Tom', 'Allen', 7, 6);



