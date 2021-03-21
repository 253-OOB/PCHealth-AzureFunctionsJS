
INSERT INTO [PC_Health].[dbo].[Organisations] (Name, Password, Email) VALUES ('aub', '123', 'it@aub.com')

GO

INSERT INTO [PC_Health].[dbo].[Accounts] (Email, OrganisationID, Username, Password) 
    VALUES 
        ('aat36@mail.aub.edu', 1, 'aat36', '$2b$10$5/w4AE0LBrcMKm83MzLY7.mexpRgB8/1HwCOowMQT918g//CCtMMG'), -- pass: abc123
        ('mib16@mail.aub.edu', 1, 'mib16', '123'), -- pass: 123abc
        ('lmg11@mail.aub.edu', 1, 'lmg11', '123'), -- pass: 1212a
        ('jkc01@mail.aub.edu', 1, 'jkc01', '123') -- pass: test