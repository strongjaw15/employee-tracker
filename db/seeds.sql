USE officers_db

INSERT INTO department (name)
  VALUES 
    ('Deck'),
    ('Engineering'),
    ('Steward');

INSERT INTO role (title, salary, department_id)
  VALUES 
    ('Captain', '250000', 1),
    ('1st Mate', '190000', 1),
    ('2nd Mate', '150000', 1),
    ('3rd Mate', '120000', 1),
    ('Chief Engineer', '230000', 2),
    ('1st Assistant Engineer', '190000', 2),
    ('2nd Assistant Engineer', '150000', 2),
    ('3rd Assistant Engineer', '120000', 2),
    ('Steward', '100000', 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
  VALUES 
    ('Peter', 'Webster', 1, NULL),
    ('Ellora', 'Martin', 2, 1),
    ('Brent', 'LaFarge', 3, 1),
    ('Ali', 'G', 4, 1),
    ('Christian', 'Benvin', 5, 1),
    ('Wayne', 'Glowack', 6, 5),
    ('Sam', 'Porter', 7, 5),
    ('Sabrina', 'Wiater', 8, 5),
    ('Dustin', 'Froman', 9, 1);