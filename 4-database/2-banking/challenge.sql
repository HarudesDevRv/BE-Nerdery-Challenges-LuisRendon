/*
    Challenge: Implement a Secure Fund Transfer Function

    In this challenge, you will implement a PostgreSQL stored function to simulate transferring funds 
    between two accounts in a banking system. The function must follow proper validation, ensure data 
    integrity, and log transactions with a shared reference.

    Your function should be named:
    banking.transfer_funds(from_id INT, to_id INT, amount NUMERIC)

    The function must:

    - Prevent transfers to the same account
    - Ensure the transfer amount is greater than zero
    - Validate that both sender and recipient accounts exist
    - Prevent transfers if either account is marked as "frozen"
    - Ensure the sender has sufficient funds
    - Debit the sender and credit the recipient atomically
    - Log two transactions: a withdrawal and a deposit, both linked by the same UUID reference
    - Raise meaningful exceptions for all validation failures

    The function should perform all operations within a safe transactional context, maintaining 
    database consistency even in the event of failure.

    Notes:
    - In order to test you can mock some additional data in the tables that participates in this challenge.
    - Make sure of raising errors when they're present

    ERD:
    +---------------------+            +--------------------------+
    |     accounts        |            |      transactions        |
    +---------------------+            +--------------------------+
    | account_id (PK)     |<-----------| transaction_id (PK)      |
    | balance             |            | account_id (FK)          |
    | status              |            | amount                   |
    +---------------------+            | transaction_type         |
                                       | reference                |
                                       | transaction_date         |
                                       +--------------------------+
*/


-- your solution here

CREATE OR REPLACE PROCEDURE banking.transfer_funds(
    from_id INT,
    to_id INT,
    amount NUMERIC
)
language plpgsql
AS $$
DECLARE
    sender_status TEXT;
    receiver_status TEXT;
    sender_balance NUMERIC(12,2);
    receiver_balance NUMERIC(12,2);
    reference_uuid TEXT;
BEGIN
    IF NOT EXISTS (select 1 from banking.accounts where account_id = from_id) THEN
        RAISE 'The sender account doesn''t exist';
    ELSIF NOT EXISTS (select 1 from banking.accounts where account_id = to_id) THEN
        RAISE 'The receiver account does doesn''t exist';
    ELSIF from_id = to_id THEN
        RAISE 'The sender and receiver accounts should be different';
    END IF;

    IF amount <= 0 THEN RAISE 'The transfer amount should be greater than 0'; 
    END IF;

    sender_status = (SELECT status FROM banking.accounts WHERE account_id = from_id);
    receiver_status = (SELECT status FROM banking.accounts WHERE account_id = to_id);

    IF sender_status != 'active' THEN
        RAISE 'The sender account isn''t active';
    ELSIF receiver_status != 'active' THEN
        RAISE 'The receiver account isn'' active';
    END IF;

    sender_balance = (SELECT balance FROM banking.accounts WHERE account_id = from_id);
    receiver_balance = (SELECT balance FROM banking.accounts WHERE account_id = to_id);

    IF sender_balance < amount THEN RAISE 'Insufficient account balance';
    END IF;

    UPDATE banking.accounts
    SET balance = balance - amount
    WHERE account_id = from_id;

    UPDATE banking.accounts
    SET balance = balance + amount
    WHERE account_id = to_id;

    reference_uuid = gen_random_uuid();

    INSERT INTO banking.transactions (account_id, amount, transaction_type, reference, transaction_date)
    VALUES 
        (from_id, amount, 'withdrawal', reference_uuid, CURRENT_TIMESTAMP),
        (to_id, amount, 'deposit', reference_uuid, CURRENT_TIMESTAMP);
    
    COMMIT;
END;$$;

CALL banking.transfer_funds(2, 1, 10);