export default function LocationPage() {
  return (
    <main className="login-page">
      <div className="login-card">
        <h1>Location Selection</h1>

        <label htmlFor="location">Enter your location</label>
        <input
          id="location"
          type="text"
          placeholder="Enter city or location"
        />

        <button type="button" className="primary-button">
          Continue
        </button>
      </div>
    </main>
  );
}