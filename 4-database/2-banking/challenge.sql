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

CREATE OR REPLACE FUNCTION banking.transfer_funds(
    from_id INT,
    to_id INT,
    amount NUMERIC
)
RETURNS VOID
language plpgsql
AS $$
DECLARE
BEGIN
    <<validations>>
    DECLARE
        sender_data banking.accounts%ROWTYPE;
        receiver_data banking.accounts%ROWTYPE;
    BEGIN
        --First validate the table-independent cases
        IF amount <= 0 THEN RAISE EXCEPTION 'The transfer amount should be greater than 0'; 
        END IF;
        
        IF from_id = to_id  THEN
            RAISE EXCEPTION 'The sender and receiver accounts should be different';
        END IF;

        --Get the rows data while blocking them from being modified outside the function
        SELECT * INTO sender_data FROM banking.accounts WHERE account_id = from_id FOR UPDATE;
        IF NOT FOUND THEN
            RAISE EXCEPTION 'The sender account doesn''t exist';
        END IF;

        SELECT * INTO receiver_data FROM banking.accounts WHERE account_id = to_id FOR UPDATE;
        IF NOT FOUND THEN
            RAISE EXCEPTION 'The receiver account doesn''t exist';
        END IF;

        --Validate the table-dependent cases
        IF sender_data.status != 'active' THEN
            RAISE EXCEPTION 'The sender account isn''t active';
        ELSIF receiver_data.status != 'active' THEN
            RAISE EXCEPTION 'The receiver account isn'' active';
        END IF;

        IF sender_data.balance < amount THEN RAISE EXCEPTION 'Insufficient account balance';
        END IF;

    END validations;

    --Finally update the accounts records and store the transaction data
    <<operations>>
    DECLARE
        reference_uuid banking.transactions.reference%type;
    BEGIN
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

    END operations;
        
END;$$;

select banking.transfer_funds(2, 1, 490);