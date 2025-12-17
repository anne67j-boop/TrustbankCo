import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">TrustBankCo</h1>
        <p>Your digital banking experience starts here.</p>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col md:flex-row gap-6 p-6">
        {/* Account Overview */}
        <section className="flex-1 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Account Overview</h2>
          <p className="text-lg mb-4">Balance: ₦100,000</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            View Transactions
          </button>
        </section>

        {/* Quick Actions */}
        <section className="flex-1 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Transfer Funds
            </button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              Pay Bills
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-600 p-4">
        © 2023 TrustBankCo. All rights reserved.
      </footer>
    </div>
  );
};

export default Dashboard;
