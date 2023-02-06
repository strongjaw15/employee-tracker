const inquirer = require('inquirer')
const mysql = require('mysql2')
const cTable = require('console.table')

// This creates the connection with the database.
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'garyRocks',
    database: 'officers_db'
  }
)

// This is the main menu.
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

// This shows the roles and their department.
const viewRoles = () => {
  db.query('SELECT role.id, title, salary, name AS department FROM role JOIN department ON role.department_id = department.id', (err, results) => {
    if (err) {
      console.log(err)
    } else {
      console.table(results);
      back()
    }
  })
}

// This shows the employee ID, first name, last name, job title, department, salary, and manager ID for each employee.
const viewEmployees = () => {
  db.query('SELECT employee.id, first_name, last_name, role.title, department.name AS department, salary, manager_id FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id', (err, results) => {
    if (err) {
      console.log(err)
    } else {
      console.table(results);
      back()
    }
  })
}

// This adds a new department to the department table.
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
        console.log('Success!')
        back()
      }
    })
  })
}

// This adds a new role to the role table.
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
        console.log('Success!')
        back()
      }
    })
  })
}

// This creates a new employee.
const addEmployee = () => {
  db.query(`SELECT title FROM officers_db.role`, (err, results) => {
    if (err) {
      console.log(err)
    } else {
      const roles = results.map(role => role.title)
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
          type: 'list',
          message: 'Please choose the new employee role:',
          choices: roles,
          name: 'role'
        },
        {
          type: 'input',
          message: 'Please choose the new employee manager ID:',
          name: 'manager'
        }
      ])
      .then(data => {
        const datapersist = data
        db.query(`SELECT id FROM officers_db.role WHERE title = "${datapersist.role}"`, (err, results) => {
          const role_id = results.map(role => role.id)
          db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
          VALUES(?, ?, ?, ?)`, [datapersist.first_name, datapersist.last_name, role_id[0], datapersist.manager], (err, results) => {
            if (err) {
              console.log(err)
            } else {
              console.log('Success!')
              back()
            }
          })
        })
      })
    }
  })
}

// This updates an employee role.
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