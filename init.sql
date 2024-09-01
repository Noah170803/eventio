-- Créer la table des utilisateurs
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    fullName VARCHAR(255) NOT NULL
);

-- Créer la table des sessions
CREATE TABLE Sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    userId INT NOT NULL,
    expiresAt DATETIME NOT NULL,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

-- Créer la table des évenements
CREATE TABLE Events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    organizerId INT NOT NULL,
    date DATETIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    FOREIGN KEY (organizerId) REFERENCES Users(id) ON DELETE CASCADE
);

-- Créer la table des participants
CREATE TABLE Participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    eventId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (eventId) REFERENCES Events(id) ON DELETE CASCADE
);

-- Créez des index pour améliorer les performances des requêtes
CREATE INDEX idx_userId ON Sessions(userId);
CREATE INDEX idx_eventId ON Participants(eventId);
CREATE INDEX idx_userId_eventId ON Participants(userId, eventId);
