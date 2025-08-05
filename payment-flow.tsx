import React, { useState, useEffect } from 'react';

// Reusable Step Container for consistent layout and back button
const StepContainer = ({ children, onBack, title, showBackButton = true }) => (
  <div className="relative p-6">
    {showBackButton && onBack && (
      <button
        onClick={onBack}
        className="absolute top-6 left-6 text-gray-600 hover:text-gray-900 transition-colors duration-200"
        aria-label="Go back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
    )}
    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 mt-2">
      {title}
    </h2>
    {children}
  </div>
);

// Progress Bar Component
const ProgressBar = ({ currentStep, totalSteps }) => {
  // Adjust totalSteps for progress bar if some initial steps don't count towards bank connection progress
  const effectiveTotalSteps = totalSteps - 2; // Exclude Order Summary and Payment Method Selection from progress bar
  const effectiveCurrentStep = Math.max(0, currentStep - 2); // Start counting from Bank Selection
  const progressPercentage = ((effectiveCurrentStep / (effectiveTotalSteps - 1)) * 100).toFixed(0);

  // Only show progress bar if we are in the bank connection flow
  if (currentStep < 2) {
    return null;
  }

  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
      <div
        className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progressPercentage}%` }}
      ></div>
    </div>
  );
};

// APIDetailsPanel Component
const APIDetailsPanel = ({ stepData }) => {
  if (!stepData) {
    return (
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-inner h-full overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4 text-indigo-300">API Details</h3>
        <p className="text-gray-400">Select a step on the left to see relevant API interactions.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-inner h-full overflow-y-auto">
      <h3 className="text-xl font-semibold mb-4 text-indigo-300">API Details for this Step</h3>
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-200 mb-2">Description:</h4>
        <p className="text-gray-400 text-sm">{stepData.description}</p>
      </div>

      {stepData.apiEndpoint && (
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-200 mb-2">API Endpoint:</h4>
          <code className="block bg-gray-700 p-2 rounded text-sm text-green-300 overflow-x-auto">
            {stepData.apiMethod} {stepData.apiEndpoint}
          </code>
        </div>
      )}

      {stepData.request && (
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-200 mb-2">Simulated Request Payload:</h4>
          <pre className="bg-gray-700 p-3 rounded text-sm overflow-x-auto">
            <code className="text-yellow-300">
              {JSON.stringify(stepData.request, null, 2)}
            </code>
          </pre>
        </div>
      )}

      {stepData.response && (
        <div>
          <h4 className="text-lg font-medium text-gray-200 mb-2">Simulated Response:</h4>
          <pre className="bg-gray-700 p-3 rounded text-sm overflow-x-auto">
            <code className="text-blue-300">
              {JSON.stringify(stepData.response, null, 2)}
            </code>
          </pre>
        </div>
      )}
      {!stepData.apiEndpoint && !stepData.request && !stepData.response && !stepData.webhookExample && (
        <p className="text-gray-400 text-sm">No direct API interaction at this UI step, but related backend calls are described above.</p>
      )}
      {stepData.webhookExample && (
        <div className="mt-6">
          <h4 className="text-lg font-medium text-gray-200 mb-2">Simulated Webhook Example:</h4>
          <pre className="bg-gray-700 p-3 rounded text-sm overflow-x-auto">
            <code className="text-purple-300">
              {JSON.stringify(stepData.webhookExample, null, 2)}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
};


// 0. Order Summary Screen
const OrderSummaryScreen = ({ onProceed }) => {
  const orderItems = [
    { name: 'Product A', price: 29.99, qty: 1 },
    { name: 'Product B', price: 15.50, qty: 2 },
    { name: 'Shipping', price: 5.00, qty: 1, isService: true },
  ];
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.08; // Example 8% tax
  const total = subtotal + tax;

  return (
    <StepContainer title="Order Summary" showBackButton={false}>
      <div className="mb-6 border-b border-gray-200 pb-4">
        {orderItems.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-1 text-gray-700">
            <span>{item.name} {item.qty > 1 ? `(x${item.qty})` : ''}</span>
            <span>${(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="mb-6 space-y-1 text-gray-700">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (8%):</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg text-gray-800 pt-2 border-t border-gray-300 mt-2">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      <button
        onClick={onProceed}
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-md"
      >
        Proceed to Payment
      </button>
    </StepContainer>
  );
};

// 1. Payment Method Selection Screen
const PaymentMethodSelectionScreen = ({ onSelectPaymentMethod, onBack }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleContinue = () => {
    if (selectedOption === 'bank') {
      onSelectPaymentMethod('bank');
    } else if (selectedOption === 'card') {
      // For demo, do nothing or show a message for card payment
      // Changed alert() to a custom message for better UX in an iframe environment
      const messageBox = document.createElement('div');
      messageBox.className = 'fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50';
      messageBox.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-xl text-center">
          <p class="text-gray-800 text-lg mb-4">Card payment selected. This demo focuses on bank payments.</p>
          <button id="closeMessageBox" class="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700">OK</button>
        </div>
      `;
      document.body.appendChild(messageBox);
      document.getElementById('closeMessageBox').onclick = () => {
        document.body.removeChild(messageBox);
      };
    }
  };

  return (
    <StepContainer title="Select Payment Method" onBack={onBack}>
      <p className="text-gray-600 text-center mb-6">
        Choose how you'd like to pay for your order.
      </p>
      <div className="space-y-4 mb-6">
        <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200">
          <input
            type="radio"
            name="paymentMethod"
            value="bank"
            checked={selectedOption === 'bank'}
            onChange={() => setSelectedOption('bank')}
            className="form-radio text-indigo-600 h-5 w-5"
          />
          <span className="ml-3 text-gray-800 font-medium text-lg">Pay by bank</span>
        </label>
        <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200">
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={selectedOption === 'card'}
            onChange={() => setSelectedOption('card')}
            className="form-radio text-indigo-600 h-5 w-5"
          />
          <span className="ml-3 text-gray-800 font-medium text-lg">Card payment</span>
        </label>
      </div>
      <button
        onClick={handleContinue}
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-md"
        disabled={!selectedOption}
      >
        Continue
      </button>
    </StepContainer>
  );
};

// 2. Bank Selection Screen (old index 1)
const BankSelectionScreen = ({ onSelectBank, onBack }) => {
  const popularBanks = [
    'Chase Bank', 'Bank of America', 'Wells Fargo', 'Citibank', 'USAA', 'Capital One'
  ];
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllBanks, setShowAllBanks] = useState(false);

  const filteredBanks = popularBanks.filter(bank =>
    bank.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <StepContainer title="Select your bank" onBack={onBack}>
      <input
        type="text"
        placeholder="Search for your bank..."
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="mb-4">
        <p className="text-gray-600 font-semibold mb-2">Popular banks</p>
        <div className="grid grid-cols-2 gap-3">
          {popularBanks.slice(0, showAllBanks ? popularBanks.length : 4).map((bank, index) => (
            <button
              key={index}
              onClick={() => onSelectBank(bank)}
              className="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150 ease-in-out text-gray-800 font-medium text-sm"
            >
              <img
                src={`https://placehold.co/24x24/e0e0e0/000000?text=${bank.split(' ')[0][0]}`} // Placeholder for bank logo
                alt={`${bank} logo`}
                className="w-6 h-6 mr-2 rounded-full"
                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/24x24/e0e0e0/000000?text=${bank.split(' ')[0][0]}` }}
              />
              {bank}
            </button>
          ))}
        </div>
        {!showAllBanks && popularBanks.length > 4 && (
          <button
            onClick={() => setShowAllBanks(true)}
            className="w-full text-indigo-600 text-sm font-medium mt-3 hover:underline"
          >
            Show all banks
          </button>
        )}
      </div>

      <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg mt-4">
        {searchTerm && filteredBanks.length > 0 ? (
          filteredBanks.map((bank, index) => (
            <button
              key={index}
              onClick={() => onSelectBank(bank)}
              className="w-full text-left p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition duration-150 ease-in-out text-gray-700"
            >
              {bank}
            </button>
          ))
        ) : searchTerm && filteredBanks.length === 0 ? (
          <p className="p-3 text-gray-500 text-center">No banks found for "{searchTerm}".</p>
        ) : null}
      </div>
    </StepContainer>
  );
};

// 3. Login Screen (old index 2)
const LoginScreen = ({ onLoginSuccess, onBack, selectedBank }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setError('');
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    setIsLoading(true);
    // Simulate API call and success/failure
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(); // Always succeed for demo
    }, 1500); // Simulate network delay
  };

  return (
    <StepContainer title={`Log in to ${selectedBank}`} onBack={onBack}>
      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
      <div className="mb-4">
        <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-2">
          Username
        </label>
        <input
          type="text"
          id="username"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          disabled={isLoading}
        />
      </div>
      <div className="mb-6">
        <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          disabled={isLoading}
        />
      </div>
      <button
        onClick={handleLogin}
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-md flex items-center justify-center"
        disabled={isLoading}
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          'Submit'
        )}
      </button>
    </StepContainer>
  );
};

// 4. MFA Screen (old index 3)
const MFAScreen = ({ onMFASuccess, onBack, selectedBank }) => {
  const [mfaType, setMfaType] = useState(''); // 'text', 'email', 'questions'
  const [mfaCode, setMfaCode] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleMFA = () => {
    setError('');
    if (mfaType === 'text' || mfaType === 'email') {
      if (!mfaCode) {
        setError('Please enter the code.');
        return;
      }
    } else if (mfaType === 'questions') {
      if (!securityAnswer) {
        setError('Please answer the security question.');
        return;
      }
    } else {
      setError('Please select an MFA option.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onMFASuccess(); // Always succeed for demo
    }, 1500); // Simulate network delay
  };

  useEffect(() => {
    // Reset inputs when MFA type changes
    setMfaCode('');
    setSecurityQuestion('');
    setSecurityAnswer('');
    setError('');
  }, [mfaType]);

  return (
    <StepContainer title={`Verify your identity at ${selectedBank}`} onBack={onBack}>
      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

      <p className="text-gray-700 mb-4">How would you like to verify your identity?</p>

      <div className="space-y-3 mb-6">
        <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200">
          <input
            type="radio"
            name="mfaOption"
            value="text"
            checked={mfaType === 'text'}
            onChange={() => setMfaType('text')}
            className="form-radio text-indigo-600 h-4 w-4"
            disabled={isLoading}
          />
          <span className="ml-3 text-gray-700 font-medium">Text message to (XXX) XXX-1234</span>
        </label>
        <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200">
          <input
            type="radio"
            name="mfaOption"
            value="email"
            checked={mfaType === 'email'}
            onChange={() => setMfaType('email')}
            className="form-radio text-indigo-600 h-4 w-4"
            disabled={isLoading}
          />
          <span className="ml-3 text-gray-700 font-medium">Email to example@email.com</span>
        </label>
        <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200">
          <input
            type="radio"
            name="mfaOption"
            value="questions"
            checked={mfaType === 'questions'}
            onChange={() => {
              setMfaType('questions');
              setSecurityQuestion('What was the make of your first car?'); // Mock question
            }}
            className="form-radio text-indigo-600 h-4 w-4"
            disabled={isLoading}
          />
          <span className="ml-3 text-gray-700 font-medium">Security questions</span>
        </label>
      </div>

      {mfaType === 'text' && (
        <div className="mb-6">
          <label htmlFor="mfaCode" className="block text-gray-700 text-sm font-medium mb-2">
            Enter code from text message
          </label>
          <input
            type="text"
            id="mfaCode"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value)}
            placeholder="e.g., 123456"
            disabled={isLoading}
          />
        </div>
      )}

      {mfaType === 'email' && (
        <div className="mb-6">
          <label htmlFor="mfaCode" className="block text-gray-700 text-sm font-medium mb-2">
            Enter code from email
          </label>
          <input
            type="text"
            id="mfaCode"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value)}
            placeholder="e.g., 654321"
            disabled={isLoading}
          />
        </div>
      )}

      {mfaType === 'questions' && (
        <div className="mb-6">
          <label htmlFor="securityAnswer" className="block text-gray-700 text-sm font-medium mb-2">
            {securityQuestion}
          </label>
          <input
            type="text"
            id="securityAnswer"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
            value={securityAnswer}
            onChange={(e) => setSecurityAnswer(e.target.value)}
            placeholder="Your answer"
            disabled={isLoading}
          />
        </div>
      )}

      <button
        onClick={handleMFA}
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-md flex items-center justify-center"
        disabled={isLoading || !mfaType}
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          'Submit'
        )}
      </button>
    </StepContainer>
  );
};


// 5. Account Selection Screen (old index 4)
const AccountSelectionScreen = ({ onSelectAccounts, onBack, selectedBank }) => {
  const mockAccounts = [
    { id: 'chk1', name: 'Checking Account', type: 'Checking', balance: '$1,234.56', selected: false },
    { id: 'sav1', name: 'Savings Account', type: 'Savings', balance: '$5,678.90', selected: false },
    { id: 'cc1', name: 'Credit Card (1234)', type: 'Credit Card', balance: '-$345.00', selected: false },
  ];
  const [accounts, setAccounts] = useState(mockAccounts);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckboxChange = (id) => {
    setAccounts(prevAccounts =>
      prevAccounts.map(account =>
        account.id === id ? { ...account, selected: !account.selected } : account
      )
    );
  };

  const handleSubmit = () => {
    const selected = accounts.filter(acc => acc.selected);
    if (selected.length === 0) {
      // In a real scenario, you might want to force selection or handle this.
      // For this demo, we'll just proceed if nothing is selected.
      onSelectAccounts([]);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSelectAccounts(selected.map(acc => acc.name));
    }, 1500); // Simulate network delay
  };

  return (
    <StepContainer title={`Select accounts from ${selectedBank}`} onBack={onBack}>
      <p className="text-gray-700 mb-4">
        Select the accounts you'd like to connect.
      </p>
      <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg mb-6">
        {accounts.map((account) => (
          <label
            key={account.id}
            className="flex items-center p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer"
          >
            <input
              type="checkbox"
              checked={account.selected}
              onChange={() => handleCheckboxChange(account.id)}
              className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
              disabled={isLoading}
            />
            <div className="ml-4 flex-grow">
              <p className="font-medium text-gray-800">{account.name}</p>
              <p className="text-sm text-gray-500">{account.type} • {account.balance}</p>
            </div>
          </label>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-md flex items-center justify-center"
        disabled={isLoading}
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          'Continue'
        )}
      </button>
    </StepContainer>
  );
};

// NEW: 6. Microdeposit Verification Screen
const MicrodepositVerificationScreen = ({ onVerifySuccess, onBack, selectedBank }) => {
  const [deposit1, setDeposit1] = useState('');
  const [deposit2, setDeposit2] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = () => {
    setError('');
    // Simple validation for demo: ensure both fields are filled and are numbers
    if (!deposit1 || !deposit2 || isNaN(parseFloat(deposit1)) || isNaN(parseFloat(deposit2))) {
      setError('Please enter valid numeric amounts for both microdeposits.');
      return;
    }

    // In a real scenario, you'd send these to Plaid's /auth/verify endpoint
    // For demo, any valid input will succeed.
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onVerifySuccess();
    }, 1500); // Simulate network delay
  };

  return (
    <StepContainer title={`Verify Microdeposits for ${selectedBank}`} onBack={onBack}>
      <p className="text-gray-700 mb-4 text-center">
        We've sent two small deposits to your account. Please enter the amounts below once they appear on your bank statement.
      </p>
      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
      <div className="mb-4">
        <label htmlFor="deposit1" className="block text-gray-700 text-sm font-medium mb-2">
          First Deposit Amount
        </label>
        <input
          type="number"
          step="0.01"
          id="deposit1"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
          value={deposit1}
          onChange={(e) => setDeposit1(e.target.value)}
          placeholder="e.g., 0.12"
          disabled={isLoading}
        />
      </div>
      <div className="mb-6">
        <label htmlFor="deposit2" className="block text-gray-700 text-sm font-medium mb-2">
          Second Deposit Amount
        </label>
        <input
          type="number"
          step="0.01"
          id="deposit2"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
          value={deposit2}
          onChange={(e) => setDeposit2(e.target.value)}
          placeholder="e.g., 0.34"
          disabled={isLoading}
        />
      </div>
      <button
        onClick={handleVerify}
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-md flex items-center justify-center"
        disabled={isLoading}
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          'Verify Account'
        )}
      </button>
    </StepContainer>
  );
};


// 7. Success Screen (old index 5)
const SuccessScreen = ({ selectedBank, selectedAccounts, onReset }) => (
  <StepContainer title="Success!" showBackButton={false}>
    <div className="text-green-500 text-6xl mb-4 flex justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <p className="text-gray-600 text-center mb-2">
      Your account{selectedAccounts.length > 1 ? 's' : ''} from <span className="font-semibold">{selectedBank}</span> has been successfully connected and verified.
    </p>
    {selectedAccounts.length > 0 && (
      <ul className="list-disc list-inside text-gray-600 text-center mb-4">
        {selectedAccounts.map((account, index) => (
          <li key={index}>{account}</li>
        ))}
      </ul>
    )}
    <p className="text-gray-600 text-center mb-6">
      You can now proceed with your payment.
    </p>
    <button
      onClick={onReset}
      className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 shadow-md"
    >
      Start Over
    </button>
  </StepContainer>
);


// API Data for each step
const apiData = {
  0: { // Order Summary Screen
    description: "This is the initial checkout screen where a user reviews their order before proceeding to payment. No direct Plaid API calls are made here, but the application is preparing for the payment initiation flow.",
  },
  1: { // Payment Method Selection Screen
    description: "The user selects their preferred payment method. If 'Pay by bank' is chosen, the application will then initiate the Plaid Link flow. No direct Plaid API calls are made at this specific UI step, but it's a critical decision point for the payment journey.",
  },
  2: { // Bank Selection Screen (corresponds to old step 1)
    description: "The user selects their financial institution within Plaid Link. Your application's backend will have already created a `link_token` for this session, which is used to initialize Plaid Link.",
    apiEndpoint: "/link/token/create",
    apiMethod: "POST",
    request: {
      user: { client_user_id: "user-unique-id-123" },
      client_name: "Your App Name",
      products: ["auth", "transactions", "payment_initiation"],
      country_codes: ["US"],
      language: "en",
      webhook: "https://your-app.com/plaid/webhook"
    },
    response: {
      link_token: "link-token-sandbox-abcdef1234567890",
      expiration: "2025-08-05T12:00:00Z",
      request_id: "req-id-xyz"
    }
  },
  3: { // Login Screen (corresponds to old step 2)
    description: "The user enters their bank credentials directly into the secure Plaid Link UI. Plaid handles the direct authentication with the financial institution. Upon successful login (and potentially MFA), Plaid Link returns a `public_token` to your frontend. Your frontend then sends this `public_token` to your backend to exchange for an `access_token`.",
    apiEndpoint: "/item/public_token/exchange",
    apiMethod: "POST",
    request: {
      client_id: "YOUR_PLAID_CLIENT_ID",
      secret: "YOUR_PLAID_SECRET",
      public_token: "public-token-sandbox-abcdef1234567890" // Received from Plaid Link on frontend
    },
    response: {
      access_token: "access-token-sandbox-0987654321fedcba",
      item_id: "item-id-1234567890abcdef",
      request_id: "req-id-abc"
    }
  },
  4: { // MFA Screen (corresponds to old step 3)
    description: "If the financial institution requires Multi-Factor Authentication (MFA), Plaid Link presents the challenge to the user. The user completes the MFA within the Plaid Link UI. Once MFA is successful, the `public_token` is then returned to your frontend, allowing your backend to exchange it for an `access_token` (as shown in the previous step).",
    apiEndpoint: "Handled internally by Plaid Link",
    apiMethod: "N/A",
    request: "MFA details are handled securely within Plaid Link and not directly exposed to your application's backend.",
    response: "Success of MFA leads to the `public_token` being issued, which is then exchanged for an `access_token`."
  },
  5: { // Account Selection Screen (corresponds to old step 4)
    description: "After successful authentication and `access_token` retrieval, your backend can use the `access_token` to fetch the user's accounts from Plaid. The user then selects which accounts they want to connect or use for the payment.",
    apiEndpoint: "/accounts/get",
    apiMethod: "POST",
    request: {
      client_id: "YOUR_PLAID_CLIENT_ID",
      secret: "YOUR_PLAID_SECRET",
      access_token: "access-token-sandbox-0987654321fedcba"
    },
    response: {
      accounts: [
        { account_id: "acc-id-1", name: "Checking Account", type: "depository", subtype: "checking", balances: { current: 1234.56 } },
        { account_id: "acc-id-2", name: "Savings Account", type: "depository", subtype: "savings", balances: { current: 5678.90 } }
      ],
      item: { item_id: "item-id-1234567890abcdef", institution_id: "ins_12345" },
      request_id: "req-id-def"
    }
  },
  6: { // Microdeposit Verification Screen (NEW)
    description: "If instant authentication is not possible or desired, Plaid can initiate microdeposits to verify account ownership. Your application would instruct the user to check their bank statement for these small deposits. Once the user provides the amounts, your backend calls Plaid's `/auth/verify` endpoint.",
    apiEndpoint: "/auth/verify",
    apiMethod: "POST",
    request: {
      client_id: "YOUR_PLAID_CLIENT_ID",
      secret: "YOUR_PLAID_SECRET",
      access_token: "access-token-sandbox-0987654321fedcba",
      account_id: "acc-id-1", // The account being verified
      amounts: [0.12, 0.34] // Amounts entered by the user
    },
    response: {
      account: { account_id: "acc-id-1", status: "successfully_verified" },
      item: { item_id: "item-id-1234567890abcdef" },
      request_id: "req-id-jkl"
    }
  },
  7: { // Success Screen (corresponds to old step 5)
    description: "The bank account connection and verification are complete. For a 'Pay by Bank' flow, the next step would be to initiate the payment using Plaid's Payment Initiation product. Your backend would make a call to `/payment_initiation/payment/create`. Plaid then sends webhooks to your application to update you on the payment's status (e.g., `PAYMENT_STATUS_EXECUTED`).",
    apiEndpoint: "/payment_initiation/payment/create",
    apiMethod: "POST",
    request: {
      client_id: "YOUR_PLAID_CLIENT_ID",
      secret: "YOUR_PLAID_SECRET",
      recipient_id: "rec-id-abcdef1234567890", // Obtained from /payment_initiation/recipient/create
      amount: { value: 100.00, currency: "GBP" }, // Example for UK/Europe
      reference: "Order #XYZ-789 Payment",
      options: {
        redirect_uri: "https://your-app.com/payment-redirect"
      }
    },
    response: {
      payment_id: "payment-id-sandbox-abcdef1234567890",
      status: "PAYMENT_STATUS_INPUT_NEEDED", // User needs to authenticate payment at their bank
      request_id: "req-id-ghi",
      consent_id: "consent-id-jkl"
    },
    webhookExample: {
        webhook_type: "PAYMENT_INITIATION",
        webhook_code: "PAYMENT_STATUS_UPDATE",
        payment_id: "payment-id-sandbox-abcdef1234567890",
        new_payment_status: "PAYMENT_STATUS_EXECUTED",
        old_payment_status: "PAYMENT_STATUS_INPUT_NEEDED",
        timestamp: "2025-08-05T12:30:00Z"
    }
  },
};


// Main App Component
const App = () => {
  // Use a numerical step for easier progress bar management
  const [currentStep, setCurrentStep] = useState(0); // 0: Order Summary, 1: Payment Method, 2: Bank Selection, 3: Login, 4: MFA, 5: Account Selection, 6: Microdeposit, 7: Success
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedAccounts, setSelectedAccounts] = useState([]); // Array to hold selected account names

  const totalSteps = 8; // Total number of distinct screens in the flow (0 to 7)

  const goToNextStep = (data = {}) => {
    if (currentStep === 2 && data.bankName) { // Bank Selection -> Login
      setSelectedBank(data.bankName);
    } else if (currentStep === 5 && data.accounts) { // Account Selection -> Microdeposit
      setSelectedAccounts(data.accounts);
    }
    setCurrentStep(prev => prev + 1);
  };

  const goToPreviousStep = () => {
    // Special handling for back from Payment Method Selection to Order Summary
    if (currentStep === 1) {
      setCurrentStep(0);
    } else if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const resetFlow = () => {
    setCurrentStep(0);
    setSelectedBank('');
    setSelectedAccounts([]);
  };

  const renderScreen = () => {
    switch (currentStep) {
      case 0:
        return <OrderSummaryScreen onProceed={() => goToNextStep()} />;
      case 1:
        return <PaymentMethodSelectionScreen onSelectPaymentMethod={(method) => {
          if (method === 'bank') goToNextStep(); // Proceed to Bank Selection
          // else do nothing for 'card' in this demo
        }} onBack={goToPreviousStep} />;
      case 2:
        return <BankSelectionScreen onSelectBank={(bankName) => goToNextStep({ bankName })} onBack={goToPreviousStep} />;
      case 3:
        return <LoginScreen onLoginSuccess={() => goToNextStep()} onBack={goToPreviousStep} selectedBank={selectedBank} />;
      case 4:
        return <MFAScreen onMFASuccess={() => goToNextStep()} onBack={goToPreviousStep} selectedBank={selectedBank} />;
      case 5:
        return <AccountSelectionScreen onSelectAccounts={(accounts) => goToNextStep({ accounts })} onBack={goToPreviousStep} selectedBank={selectedBank} />;
      case 6:
        return <MicrodepositVerificationScreen onVerifySuccess={() => goToNextStep()} onBack={goToPreviousStep} selectedBank={selectedBank} />;
      case 7:
        return <SuccessScreen selectedBank={selectedBank} selectedAccounts={selectedAccounts} onReset={resetFlow} />;
      default:
        return <OrderSummaryScreen onProceed={() => goToNextStep()} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div className="flex w-full max-w-5xl rounded-lg shadow-xl overflow-hidden border border-gray-200">
        {/* Left Column: UI Flow */}
        <div className="w-1/2 bg-white flex flex-col">
          {/* Progress bar only shows for steps 2 onwards (bank connection flow) */}
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
          <div className="flex-grow">
            {renderScreen()}
          </div>
        </div>

        {/* Right Column: API Details */}
        <div className="w-1/2 bg-gray-800 text-white p-6 flex flex-col">
          <APIDetailsPanel stepData={apiData[currentStep]} />
        </div>
      </div>
    </div>
  );
};

export default App;
