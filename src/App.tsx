import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface FormData {
  callFailure: number;
  complains: number;
  subscriptionLength: number;
  chargeAmount: number;
  secondsOfUse: number;
  frequencyOfUse: number;
  frequencyOfSMS: number;
  distinctCalledNumbers: number;
  ageGroup: number;
  tariffPlan: number;
  status: number;
  age: number;
  customerValue: number;
}

const initialFormData: FormData = {
  callFailure: 0,
  complains: 0,
  subscriptionLength: 0,
  chargeAmount: 0,
  secondsOfUse: 0,
  frequencyOfUse: 0,
  frequencyOfSMS: 0,
  distinctCalledNumbers: 0,
  ageGroup: 1,
  tariffPlan: 1,
  status: 1,
  age: 18,
  customerValue: 0
};

function App() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [prediction, setPrediction] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const data = await response.json();
      setPrediction(data.churn_probability);
    } catch (err) {
      setError('Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Churn Prediction</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter customer data to predict churn probability
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            {Object.entries(formData).map(([key, value], index) => (
              <div key={key} className="mb-4">
                <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                  {key.replace(/([A-Z])/g, ' $1').charAt(0).toUpperCase() + key.replace(/([A-Z])/g, ' $1').slice(1)}
                </label>
                <input
                  type="number"
                  name={key}
                  id={key}
                  value={value}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
            ))}
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Predicting...' : 'Predict Churn'}
          </button>
        </form>

        {prediction !== null && !error && (
          <div className={`mt-8 p-4 rounded-md ${prediction ? 'bg-red-50' : 'bg-green-50'}`}>
            <p className={`text-lg font-semibold ${prediction ? 'text-red-800' : 'text-green-800'}`}>
              {prediction ? 'Customer is likely to churn' : 'Customer is likely to stay'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;