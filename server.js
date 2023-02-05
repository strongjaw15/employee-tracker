const inquirer = require('inquirer')
const mysql = require('mysql2')
const consoleTable = require('console.table')

const PORT = process.env.PORT || 3001

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'garyRocks',
    database: 'officers_db'
  }
)

// GIVEN a command-line application that accepts user input
// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

const mainMenu = () => {
  inquirer.createPromptModule([
    {
      type: 'list',
      message: 'Please choose an option:',
      choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role'],
      name: 'mainSelection'
    }
  ])
  .then(data => {
    switch(data.mainSelection){
      case 'View All Departments': viewDepartments()
        break;
      case 'View All Roles': viewRoles()
        break;
      case 'View All Employees': viewEmployees()
        break;
      case 'Add a Department': addDepartment()
        break;
      case 'Add a Role': addRole()
        break;
      case 'Add an Employee': addEmployee()
        break;
      case 'Update an Employee Role': updateEmployeeRole()
        break;
    }
  })
}

// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids

db.query('SELECT * FROM department', function (err, results) {
  console.log(results);
})

// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role



// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to



// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database



// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database



// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database



// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database

mainMenu()