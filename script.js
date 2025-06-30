document.addEventListener('DOMContentLoaded', function() {
    const upiForm = document.getElementById('upi-form');
    const messageDiv = document.getElementById('message');

    upiForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form from submitting

        // Get form values
        const upiId = document.getElementById('upi-id').value.trim();
        const amount = document.getElementById('amount').value.trim();

        // Simple validation
        if (!validateUpiId(upiId)) {
            showMessage('Please enter a valid UPI ID.', 'error');
            return;
        }

        if (!validateAmount(amount)) {
            showMessage('Please enter a valid amount.', 'error');
            return;
        }

        // Simulate payment processing
        showMessage('Processing your payment...', 'info');
        setTimeout(() => {
            // Randomly decide if payment is successful or failed
            const isSuccess = Math.random() < 0.8; // 80% success rate
            if (isSuccess) {
                showMessage(`Payment of ₹${amount} was successful!`, 'success');
                upiForm.reset();
            } else {
                showMessage('Payment failed. Please try again.', 'error');
            }
        }, 2000); // Simulate a 2-second processing time
    });

    function validateUpiId(upiId) {
        // Simple regex for UPI ID validation (e.g., example@bank)
        const upiRegex = /^[\w.-]+@[\w.-]+$/;
        return upiRegex.test(upiId);
    }

    function validateAmount(amount) {
        const amt = parseFloat(amount);
        return !isNaN(amt) && amt > 0;
    }

    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
    }
});
