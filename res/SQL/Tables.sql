
CREATE TABLE Organisations (

	OrganisationID int NOT NULL IDENTITY(1,1) PRIMARY KEY,
	Name varchar(50) NOT NULL,
	Password varchar(50) NOT NULL,
	Email varchar(50)

)

CREATE TABLE Accounts (

	ID int NOT NULL IDENTITY(1,1) PRIMARY KEY,
	Email varchar(50) NOT NULL UNIQUE,
	OrganisationID int NOT NULL FOREIGN KEY REFERENCES Organisations(OrganisationID),
	Username varchar(50) NOT NULL,
	Password varchar(50) NOT NULL,
	Refresh_Token varchar(256),
	CONSTRAINT COMPANY_USERNAME UNIQUE (OrganisationID, Username)

)