DROP DATABASE IF EXISTS officers_db;
CREATE DATABASE officers_db;

USE officers_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
    FOREIGN KEY (role_id)
    REFERENCES role(id),
  manager_id INT NULL,
    FOREIGN KEY (manager_id)
    REFERENCES employee(id)
);