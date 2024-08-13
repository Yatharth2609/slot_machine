let balance = 0;

document.getElementById('spin-button').addEventListener('click', spin);
document.getElementById('deposit-button').addEventListener('click', deposit);

async function spin() {
    const lines = parseInt(document.getElementById('lines').value);
    const bet = parseInt(document.getElementById('bet').value);

    if (isNaN(lines) || isNaN(bet)) {
        showMessage('Please enter valid numbers for all fields.');
        return;
    }

    if (bet * lines > balance) {
        showMessage('Insufficient balance for this bet. Please deposit more money.');
        showDepositOption();
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/spin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bet, lines }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();

        updateSlotMachine(result.rows);
        balance += result.winnings - (bet * lines);
        showMessage(`You won $${result.winnings}!`);
        updateBalance();
        hideDepositOption();
    } catch (error) {
        console.error('Error:', error);
        showMessage('An error occurred. Please try again.');
    }
}

function deposit() {
    const depositAmount = parseInt(document.getElementById('deposit-amount').value);
    
    if (isNaN(depositAmount) || depositAmount <= 0) {
        showMessage('Please enter a valid deposit amount.');
        return;
    }

    balance += depositAmount;
    updateBalance();
    showMessage(`Successfully deposited $${depositAmount}.`);
    hideDepositOption();
}

function updateSlotMachine(rows) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            document.getElementById(`slot${i*3 + j + 1}`).textContent = rows[i][j];
        }
    }
}

function showMessage(msg) {
    document.getElementById('message').textContent = msg;
}

function updateBalance() {
    document.getElementById('balance').textContent = `Balance: $${balance}`;
}

function showDepositOption() {
    document.getElementById('deposit-container').style.display = 'block';
}

function hideDepositOption() {
    document.getElementById('deposit-container').style.display = 'none';
}

updateBalance();