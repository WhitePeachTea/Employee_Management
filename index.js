const inquirer = require('inquirer');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    port: process.env.PORT || 3306,
    user: "root",
    password: "password",
    database: "employeeDB"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    inquirer.prompt({
            name: "begin",
            type: "list",
            message: "What would you like to do?",
            choices:
                [
                    "View All Employees",
                    "View Employees by Department",
                    "View Employees by Role",
                    "Update Employee's Role",
                    "Add Employee",
                    "Add Department",
                    "Add Role",
                    "Delete",
                    "Quit"
                ]
        })
        .then(answers => {
            if (answers.begin === "View All Employees") {
                viewAllEmployee();
            }
            else if (answers.begin === "View Employees by Department") {
                viewByDeparment();
            }
            else if (answers.begin === "View Employees by Role") {
                viewByRole();
            }
            else if (answers.begin === "Add Employee") {
                addEmployee();
            }
            else if (answers.begin === "Add Department") {
                addDepartment();
            }
            else if (answers.begin === "Add Role") {
                addRole();
            }
            else if (answers.begin === "Update Employee's Role") {
                updateEmployee();
            }
            else if ((answers.begin) === "Delete") {
                Delete();
            }
            else if (answers.begin === "Quit") {
                console.log("END");
            }
            else {
                connection.end();
            }
        });
}


function viewAllEmployee() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, role.title, role.salary, department.name FROM ((employee INNER JOIN role ON employee.role_id = role.id) INNER JOIN department ON role.department_id = department.id)", function (err, result) {
        if (err) throw err;
        console.table(result);
        start();
    });
}

function viewByDeparment(){
    inquirer.prompt({
        name: "department",
        type: "list",
        message: "Which is the department for this employee?",
        choices: ["Sales", "Finance", "Engineering", "Legal"]
    })
    .then(answers => {
        if (answers.department === "Sales" || "Finance" || "Engineering" || "Legal") {
            connection.query("SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, role.title, role.salary, department.name FROM ((employee INNER JOIN role ON employee.role_id = role.id) INNER JOIN department ON role.department_id = department.id) WHERE name = ?", [answers.department], function (err, result) {
                if (err) throw err;
                console.table(result);
                start();
            });
        }
    });
}

function viewByRole() {
    inquirer.prompt({
            name: "role",
            type: "list",
            message: "What is the role for this employee?",
            choices:
                [
                    "Lead Engineer",
                    "Software Engineer",
                    "Sales Lead",
                    "Salesperson",
                    "Accountant",
                    "Leagal Team Lead",
                    "Lawyer"
                ]
        })
        .then(answers => {
            if (answers.role === "Lead Engineer" || "Software Engineer" || "Sales Lead" || "Salesperson" || "Accountant" || "Leagal Team Lead" || "Lawyer" ) {
                connection.query("SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, role.title, role.salary, department.name FROM ((employee INNER JOIN role ON employee.role_id = role.id) INNER JOIN department ON role.department_id = department.id) WHERE title = ?", [answers.role], function (err, result) {
                    if (err) throw err;
                    console.table(result);
                    start();
                });
            }
        });
}


function addEmployee() {
    inquirer.prompt([
            {
                name: "first",
                type: "input",
                message: "What is the employee's first name?"
            },
            {
                name: "last",
                type: "input",
                message: "What is the employee's last name?"
            },
            {
                name: "title",
                type: "list",
                message: "What is the employee's role?",
                choices:
                    [
                        "Lead Engineer",
                        "Software Engineer",
                        "Sales Lead",
                        "Salesperson",
                        "Accountant",
                        "Leagal Team Lead",
                        "Lawyer"
                    ]
            },
            {
                name: "salary",
                type: "input",
                message: "What is the employee's salary?"
            },
            {
                name: "dept",
                type: "list",
                message: "What is the employee's department?",
                choices: ["Sales", "Finance", "Engineering", "Legal"]
            }
        ])
        .then(answers => {

            var dept_id;
            if (answers.dept === "Sales") {
                dept_id = 1;
            }
            else if (answers.dept === "Finance") {
                dept_id = 2;
            }
            else if (answers.dept === "Engineering") {
                dept_id = 3;
            }
            else if (answers.dept === "Legal") {
                dept_id = 4;
            }

            connection.query("INSERT INTO role SET ?",
                {
                    title: answers.title,
                    salary: answers.salary,
                    department_id: dept_id
                },
                function (err, result) {
                    if (err) throw err;
                }
            );

            var role_id;
            if (answers.title === "Lead Engineer") {
                role_id = 5;
            }
            else if (answers.title === "Software Engineer") {
                role_id = 4;
            }
            else if (answers.title === "Sales Lead") {
                role_id = 1;
            }
            else if (answers.title === "Salesperson") {
                role_id = 2;
            }
            else if (answers.title === "Accountant") {
                role_id = 3;
            }
            else if (answers.title === "Leagal Team Lead") {
                role_id = 6;
            }
            else if (answers.title === "Lawyer") {
                role_id = 7;
            }
  

            connection.query("INSERT INTO employee SET ?",
                {
                    first_name: answers.first,
                    last_name: answers.last,
                    role_id: role_id,
                },
                function (err, result) {
                    if (err) throw err;
                    console.log("=== New Employee Added ===");
                    start();
                }
            );
        });
}


function addDepartment(){
    inquirer.prompt([
            {
                name: "depName",
                type: "input",
                message: "What is the new department's name?"
            }
        ])
        .then(answers => {
            connection.query("INSERT INTO department SET ?",
                {
                    name: answers.depName
                },
                function (err, result) {
                    if (err) throw err;
                    console.log("=== New Department Added ===");
                    start();
                }
            );
        });
}

function addRole() {
    inquirer.prompt([
            {
                name: "newRoleTitle",
                type: "input",
                message: "What is the new role's name?"
            },
            {
                name: "newSalary",
                type: "input",
                message: "What is the new role's salary?"
            },
            {
                name: "departmentId",
                type: "input",
                message: "What is the new department's name?"
            }
        ])
        .then(answers => {
            connection.query("INSERT INTO role SET ?",
                {
                    title: answers.newRoleTitle,
                    salary: answers.newSalary,
                    department_id: answers.departmentId
                },
                function (err, result) {
                    if (err) throw err;
                    console.log("=== New Role Added ===");
                    start();
                }
            );
        });
}

function updateEmployee() {
    connection.query("SELECT id, first_name, last_name FROM employee", function (err, result) {
        if (err) throw err;
        var choiceArray = [];
        for (var i = 0; i < result.length; i++) {
            var choices = result[i].first_name;
            choiceArray.push(choices);
        }
        questions = [
            {
            name: "employee",
            type: "list",
            message: "Which employee would you like to update?",
            choices: choiceArray
        },
        {
            name: "newTitle",
            type: "list",
            message: "What is the employee's new role?",
            choices:
                [
                    "Lead Engineer",
                    "Software Engineer",
                    "Sales Lead",
                    "Salesperson",
                    "Accountant",
                    "Leagal Team Lead",
                    "Lawyer"
                ]
        }]
        inquirer.prompt(questions)
            .then(answers => {
                console.log(answers.employee);
                console.log(answers.newTitle)
                let role_id = 0;
                if (answers.newTitle == "Lead Engineer") {
                    role_id = 4;
                }
                else if (answers.newTitle == "Software Engineer") {
                    role_id = 5;
                }
                else if (answers.newTitle == "Sales Lead") {
                    role_id = 1;
                }
                else if (answers.newTitle == "Salesperson") {
                    role_id = 2;
                }
                else if (answers.newTitle == "Accountant") {
                    role_id = 3;
                }
                else if (answer.newTitle == "Leagal Team Lead") {
                    role_id = 6;
                }
                else if (answer.newTitle == "Lawyer") {
                    role_id = 7;
                }
              
                connection.query("UPDATE employee SET role_id = ? WHERE id=?",
                    [role_id, answers.employee],
                    function (err, result) {
                        if (err) throw err;
                        console.log("=== Updated Employee ===");
                        start();
                    }
                )

            });
    })
}

function Delete() {
    inquirer.prompt([{
        type: 'list',
        name: 'delete',
        message: 'What would you like to delete?',
        choices: ['Department', 'Role', 'Employee']
    }]).then(answers => {
        if (answers.delete === 'Department') {
            inquirer.prompt([
                {
                    name: 'departName',
                    message: 'Which department would you like to delete?'
                }
            ]).then(answers => {
                connection.query(
                    "DELETE FROM department WHERE ?",
                    {
                        name: answers.departName
                    },
                    function(err) {
                        if (err) throw err;
                    }
                )
                start();
            });
        }
        else if (answers.delete === 'Role') {
            inquirer.prompt([
                {
                    name: 'roleTitle',
                    message: 'Which role would you like to delete?'
                }
            ]).then(answers => {
                connection.query(
                    "DELETE FROM role WHERE ?",
                    {
                        title: answers.roleTitle
                    },
                    function(err) {
                        if (err) throw err;
                    }
                )
                start();
            });
        }
        else if (answers.delete === 'Employee') {
            inquirer.prompt([
                {
                    name: 'firstName',
                    message: 'Which employee would you like to delete?'
                }
            ]).then(answers => {
                connection.query(
                    "DELETE FROM employee WHERE ?",
                    {
                        first_name: answers.firstName
                    },
                    function(err) {
                        if (err) throw err;
                    }
                )
                start();
            });
        }
    });
}