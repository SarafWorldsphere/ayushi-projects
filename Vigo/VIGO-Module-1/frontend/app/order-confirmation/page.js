export default function OrderConfirmationPage() {
  return (
    <main className="login-page">
      <div className="login-card">
        <h1>Order Confirmation</h1>

        <p>
          Your order has been placed successfully.
        </p>

        <p>
          Order details and current order status will appear here.
        </p>

        <button type="button" className="primary-button">
          View My Orders
        </button>
      </div>
    </main>
  );
}