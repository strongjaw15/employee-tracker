const inquirer = require('inquirer')
const mysql = require('mysql2')
const cTable = require('console.table')

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
  inquirer.prompt([
    {
      type: 'list',
      message: 'Please choose an option:',
      choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Quit'],
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
      case 'Quit': process.exit()
    }
  })
}

// This shows the department table.

const viewDepartments = () => {
  db.query('SELECT * FROM department', (err, results) => {
    if (err) {
      console.log(err)
    } else {
      console.table(results);
      back()
    }
  })
}

// This shows the role table.

const viewRoles = () => {
  db.query('SELECT * FROM role', (err, results) => {
    if (err) {
      console.log(err)
    } else {
      console.table(results);
      back()
    }
  })
}

// This shows the employee table.

const viewEmployees = () => {
  db.query('SELECT * FROM employee', (err, results) => {
    if (err) {
      console.log(err)
    } else {
      console.table(results);
      back()
    }
  })
}

// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database

const addDepartment = () => {
  inquirer.prompt([
    {
      type: 'input',
      message: 'Please enter the new department name:',
      name: 'name'
    }
  ])
  .then(data => {
    db.query(`INSERT INTO department (name)
    VALUES(?)`, data.name, (err, results) => {
      if (err) {
        console.log(err)
      } else {
        console.table(results)
        back()
      }
    })
  })
}

// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database

const addRole = () => {
  inquirer.prompt([
    {
      type: 'input',
      message: 'Please enter the new role title:',
      name: 'title'
    },
    {
      type: 'input',
      message: 'Please enter the new role salary:',
      name: 'salary'
    },
    {
      type: 'input',
      message: 'Please enter the new role department ID:',
      name: 'department_id'
    }
  ])
  .then(data => {
    db.query(`INSERT INTO role (title, salary, department_id)
    VALUES(?, ?, ?)`, [data.title, data.salary, data.department_id], (err, results) => {
      if (err) {
        console.log(err)
      } else {
        console.table(results)
        back()
      }
    })
  })
}

// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database

// Need to change this so that the user enters the role name and manager name and a db query comes back with the correct id numbers for those items.

const addEmployee = () => {
  inquirer.prompt([
    {
      type: 'input',
      message: 'Please enter the new employee first name:',
      name: 'first_name'
    },
    {
      type: 'input',
      message: 'Please enter the new employee last name:',
      name: 'last_name'
    },
    {
      type: 'input',
      message: 'Please enter the new employee role ID:',
      name: 'role_id'
    },
    {
      type: 'input',
      message: 'Please enter the new employee department ID:',
      name: 'department_id'
    }
  ])
  .then(data => {
    db.query(`INSERT INTO employee (first_name, last_name, role_id, department_id)
    VALUES(?, ?, ?, ?)`, [data.first_name, data.last_name, data.role_id, data.department_id], (err, results) => {
      if (err) {
        console.log(err)
      } else {
        console.table(results)
        back()
      }
    })
  })
}

// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database

const updateEmployeeRole = () => {
  db.query(`SELECT id, first_name, last_name FROM officers_db.employee`, (err, res) => {
    if (err) {
      console.log(err)
    } else {
      console.table(res);
      db.query(`SELECT id FROM officers_db.employee`, (err, results) => {
        if (err) {
          console.log(err)
        } else {
          let ids = [];
          for (i=0; i<results.length; i++) {
            ids.push(`${[i+1]}`)
          };
          inquirer.prompt([
            {
              type: 'list',
              message: 'Choose an employee by ID number:',
              choices: ids,
              name: 'employee_id'
            }
          ])
          .then(data => {
            const employee_id = data.employee_id;
            db.query(`SELECT title FROM officers_db.role`, (err, results) => {
              if (err) {
                console.log(err)
              } else {
                const titles = results.map((item) => item.title)
                inquirer.prompt([
                  {
                    type: 'list',
                    message: 'Choose the new role:',
                    choices: titles,
                    name: 'title'
                  }
                ])
                .then(data => {
                  db.query(`SELECT id FROM officers_db.role WHERE title = "${data.title}"`, (err, results) => {
                    if (err) {
                      console.log(err)
                    } else {
                      const role_id = results.map((item) => item.id)
                      db.query(`UPDATE employee SET role_id = ${role_id} WHERE id = ${employee_id}`, (err, results) => {
                        if (err) {
                          console.log(err)
                        } else {
                          console.log('Success!');
                          viewEmployees()
                        }
                      })
                    }
                  })
                })
              }
            })
          })
        }
      })
    }
  })
}

// This lets the user go back to the main menu or quit.
const back = () => {
  inquirer.prompt(
    {
      type: 'list',
      message: 'Would you like to go to the Main Menu, or quit?',
      choices: ['Main Menu', 'Quit'],
      name: 'back'
    }
  )
  .then(data => {
    switch(data.back){
      case 'Main Menu': mainMenu()
        break;
      case 'Quit': process.exit()
    }
  })
}

// This starts the program with the main menu
mainMenu()