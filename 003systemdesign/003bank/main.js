
class Transaction {
    #customerId;
    #tellerId;

    constructor(customerId, tellerId) {
        this.#customerId = customerId;
        this.#tellerId = tellerId;
    }

    getCustomerId() {
        return this.#customerId;
    }

    getTellerId() {
        return this.#tellerId;
    }

    getTransactionDescription() {}
}

class Deposit extends Transaction {
    #amount;

    constructor(customerId, tellerId, amount) {
        super(customerId, tellerId);
        this.#amount = amount;
    }

    getTransactionDescription() {
        return `Teller ${this.getTellerId()} deposited ${this.#amount} to account ${this.getCustomerId()}`;
    }
}

class Withdrawal extends Transaction {
    #amount;

    constructor(customerId, tellerId, amount) {
        super(customerId, tellerId);
        this.#amount = amount;
    }

    getTransactionDescription() {
        return `Teller ${this.getTellerId()} withdrew ${this.#amount} from account ${this.getCustomerId()}`;
    }
}

class OpenAccount extends Transaction {

    constructor(customerId, tellerId) {
        super(customerId, tellerId);
    }

    getTransactionDescription() {
        return `Teller ${this.getTellerId()} opened account ${this.getCustomerId()}`;
    }
}

class BankTeller {
    #id;

    constructor(id) {
        this.#id = id;
    }

    getId() {
        return this.#id;
    }
}

class BankBranch {
    #address;
    #cashOnHand;
    #bankSystem;
    #tellers;

    constructor(address, cashOnHand, bankSystem) {
        this.#address = address;
        this.#cashOnHand = cashOnHand;
        this.#bankSystem = bankSystem;
        this.#tellers = [];
    }

    addTeller(teller) {
        this.#tellers.push(teller);
    }

    #getAvailableTeller() {
        const index = Math.round(Math.random() * (this.#tellers.length - 1));
        return this.#tellers[index].getId();
    }

    openAccount(customerName) {
        if (this.#tellers.length === 0) {
            throw new Error('Branch does not have any tellers');
        }
        const tellerId = this.#getAvailableTeller();
        return this.#bankSystem.openAccount(customerName, tellerId);
    }

    deposit(customerId, amount) {
        if (this.#tellers.length === 0) {
            throw new Error('Branch does not have any tellers');
        }
        const tellerId = this.#getAvailableTeller();
        this.#bankSystem.deposit(customerId, tellerId, amount);
    }

    withdraw(customerId, amount) {
        if (amount > this.#cashOnHand) {
            throw new Error('Branch does not have enough cash');
        }
        if (this.#tellers.length === 0) {
            throw new Error('Branch does not have any tellers');
        }
        this.#cashOnHand -= amount;
        const tellerId = this.#getAvailableTeller();
        this.#bankSystem.withdraw(customerId, tellerId, amount);
    }

    collectCash(ratio) {
        const cashToCollect = Math.round(this.#cashOnHand * ratio);
        this.#cashOnHand -= cashToCollect;
        return cashToCollect;
    }

    provideCash(amount) {
        this.#cashOnHand += amount;
    }
}

class BankAccount {
    #customerId;
    #name;
    #balance;

    constructor(customerId, name, balance) {
        this.#customerId = customerId;
        this.#name = name;
        this.#balance = balance;
    }

    getBalance() {
        return this.#balance;
    }

    deposit(amount) {
        this.#balance += amount;
    }

    withdraw(amount) {
        this.#balance -= amount;
    }
}

class BankSystem {
    #accounts;
    #transactions;

    constructor(accounts, transactions) {
        this.#accounts = accounts;
        this.#transactions = transactions;
    }

    getAccount(customerId) {
        return this.#accounts[customerId];
    }

    getAccounts() {
        return this.#accounts;
    }

    getTransactions() {
        return this.#transactions;
    }

    openAccount(customerName, tellerId) {
        // Create account
        const customerId = this.getAccounts().length;
        const account = new BankAccount(customerId, customerName, 0);
        this.#accounts.push(account);

        // Log transaction
        const transaction = new OpenAccount(customerId, tellerId);
        this.#transactions.push(transaction);
        return customerId;
    }


    deposit(customerId, tellerId, amount) {
        const account = this.getAccount(customerId);
        account.deposit(amount);

        const transaction = new Deposit(customerId, tellerId, amount);
        this.#transactions.push(transaction);
    }

    withdraw(customerId, tellerId, amount) {
        if (amount > this.getAccount(customerId).getBalance()) {
            throw new Error('Insufficient funds');
        }
        const account = this.getAccount(customerId);
        account.withdraw(amount);

        const transaction = new Withdrawal(customerId, tellerId, amount);
        this.#transactions.push(transaction);
    }
}

class Bank {
    #branches;
    #bankSystem;
    #totalCash;

    constructor(branches, bankSystem, totalCash) {
        this.#branches = branches;
        this.#bankSystem = bankSystem;
        this.#totalCash = totalCash;
    }

    addBranch(address, initialFunds) {
        const branch = new BankBranch(address, initialFunds, this.#bankSystem);
        this.#branches.push(branch);
        return branch;
    }

    collectCash(ratio) {
        for (const branch of this.#branches) {
            const cashCollected = branch.collectCash(ratio);
            this.#totalCash += cashCollected;
        }
    }

    printTransactions() {
        for (const transaction of this.#bankSystem.getTransactions()) {
            console.log(transaction.getTransactionDescription());
        }
    }
}

const bankSystem = new BankSystem([], []);
const bank = new Bank(/* branches= */ [], bankSystem, /* totalCash= */ 10000);

const branch1 = bank.addBranch('123 Main St', /* initialFunds= */ 1000);
const branch2 = bank.addBranch('456 Elm St', /* initialFunds= */ 1000);

branch1.addTeller(new BankTeller(1));
branch1.addTeller(new BankTeller(2));
branch2.addTeller(new BankTeller(3));
branch2.addTeller(new BankTeller(4));

const customerId1 = branch1.openAccount('John Doe');
const customerId2 = branch1.openAccount('Bob Smith');
const customerId3 = branch2.openAccount('Jane Doe');

branch1.deposit(customerId1, /* amount= */ 100);
branch1.deposit(customerId2, /* amount= */ 200);
branch2.deposit(customerId3, /* amount= */ 300);

branch1.withdraw(customerId1, /* amount= */ 50);

bank.printTransactions();
/*  Possible Output:
    Teller 1 opened account 0
    Teller 2 opened account 1
    Teller 3 opened account 2
    Teller 1 deposited 100 to account 0
    Teller 2 deposited 200 to account 1
    Teller 4 deposited 300 to account 2
    Teller 2 withdrew 50 from account 0
*/

bank.collectCash(/* ratio= */ 0.5);





