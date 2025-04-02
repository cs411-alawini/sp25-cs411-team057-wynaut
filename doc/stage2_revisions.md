Comment: No mention of what normal form your schema aims to adhere to (3NF or BCNF)

Fix: We specified that we were using 3NF in our normalization section of the document


Comment: You don't have a foreign key from accounts to average expenses despite drawing a many to one relationship in your diagram

Fix: We added the foreign key to Accounts Table in the Relational Schema section

Comment: Your schema is not formatted correctly. Your relational schema should be formatted as follows:
Table-Name(Column1:Domain [PK], Column2:Domain [FK to table.column], Column3:Domain,...)

Fix: We removed the list format that we previously had and rewrote the tables so that they ahere to the correct format in the Relational Schema section.

