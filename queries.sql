-
CREATE TABLE sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    topic VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    animation VARCHAR(255),
    image VARCHAR(255),
    background_color VARCHAR(20),
    text_color VARCHAR(20),
    position_order INT
);

CREATE TABLE question_stats (
    question_id INT PRIMARY KEY,
    correct_count INT DEFAULT 0,
    incorrect_count INT DEFAULT 0,
    FOREIGN KEY (question_id) REFERENCES questions (id)
);

CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    topic VARCHAR(100),
    question TEXT NOT NULL,
    option_a VARCHAR(255),
    option_b VARCHAR(255),
    option_c VARCHAR(255),
    correct_answer VARCHAR(255)
);