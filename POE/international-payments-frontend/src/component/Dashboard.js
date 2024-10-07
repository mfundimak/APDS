import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/payments');
        setPayments(res.data);
      } catch (err) {
        console.error('Error fetching payments:', err);
      }
    };

    fetchPayments();
  }, []);

  const verifyPayment = async (paymentId) => {
    try {
      await axios.put(`http://localhost:5000/api/payments/verify/${paymentId}`);
      setPayments(payments.filter(payment => payment._id !== paymentId));  // Remove verified payment from UI
      alert('Payment verified successfully');
    } catch (err) {
      console.error('Error verifying payment:', err);
    }
  };

  return (
    <div>
      <h2>Pending Payments</h2>
      {payments.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Account Number</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>SWIFT Code</th>
              <th>Recipient Account</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment._id}>
                <td>{payment.customerId.fullName}</td>
                <td>{payment.customerId.accountNumber}</td>
                <td>{payment.amount}</td>
                <td>{payment.currency}</td>
                <td>{payment.swiftCode}</td>
                <td>{payment.recipientAccount}</td>
                <td>
                  <button onClick={() => verifyPayment(payment._id)}>Verify</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No pending payments</p>
      )}
    </div>
  );
};

export default Dashboard;
