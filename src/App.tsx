import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface FormData {
  motivation: number;
  working_independently: number;
  teamplayer: number;
  solution_oriented: number;
  age: number;
  productivity_unproductive: number;
  productivity_productive: number;
  willingness_to_learn_ready: number;
  willingness_to_learn_very_ready: number;
  temporal_availability_low: number;
  temporal_availability_medium: number;
}

interface ExamplePerson {
  name: string;
  data: FormData;
  imagePath: string;
}

const examplePersons: ExamplePerson[] = [
  {
    name: "Niklas Hettich",
    imagePath: "/images/NiklasHettich.png",
    data: {
      motivation: 10,
      working_independently: 1,
      teamplayer: 1,
      solution_oriented: 1,
      age: 21,
      productivity_unproductive: 0,
      productivity_productive: 0,
      willingness_to_learn_ready: 0,
      willingness_to_learn_very_ready: 1,
      temporal_availability_low: 0,
      temporal_availability_medium: 0,
    }
  },
  {
    name: "Nadiem",
    imagePath: "/images/mindfuel-logo.png",
    data: {
      motivation: 10,
      working_independently: 1,
      teamplayer: 1,
      solution_oriented: 1,
      age: 28,
      productivity_unproductive: 0,
      productivity_productive: 0,
      willingness_to_learn_ready: 0,
      willingness_to_learn_very_ready: 1,
      temporal_availability_low: 0,
      temporal_availability_medium: 0,
    }
  },
  {
    name: "Homer Simpson",
    imagePath: "/images/HomerSimpson.jpg",
    data: {
      motivation: 1,
      working_independently: 0,
      teamplayer: 1,
      solution_oriented: 0,
      age: 30,
      productivity_unproductive: 1,
      productivity_productive: 0,
      willingness_to_learn_ready: 1,
      willingness_to_learn_very_ready: 0,
      temporal_availability_low: 1,
      temporal_availability_medium: 0,
    }
  }
];

const initialFormData: FormData = {
  motivation: 5,
  working_independently: 0,
  teamplayer: 0,
  solution_oriented: 0,
  age: 18,
  productivity_unproductive: 1,
  productivity_productive: 0,
  willingness_to_learn_ready: 0,
  willingness_to_learn_very_ready: 0,
  temporal_availability_low: 1,
  temporal_availability_medium: 0,
};

const dropdownOptions: { [key: string]: { label: string; value: number }[] } = {
  motivation: [
    { label: 'Low', value: 1 },
    { label: 'Medium', value: 5 },
    { label: 'High', value: 10 },
  ],
  working_independently: [
    { label: 'No', value: 0 },
    { label: 'Yes', value: 1 },
  ],
  teamplayer: [
    { label: 'No', value: 0 },
    { label: 'Yes', value: 1 },
  ],
  solution_oriented: [
    { label: 'No', value: 0 },
    { label: 'Yes', value: 1 },
  ],
  age: Array.from({ length: 63 }, (_, i) => ({ label: (18 + i).toString(), value: 18 + i })),
  productivity: [
    { label: 'Unproductive', value: 0 },
    { label: 'Productive', value: 1 },
    { label: 'Highly Productive', value: 2 },
  ],
  willingness_to_learn: [
    { label: 'Not Ready', value: 0 },
    { label: 'Ready', value: 1 },
    { label: 'Very Ready', value: 2 },
  ],
  temporal_availability: [
    { label: 'Low', value: 0 },
    { label: 'Medium', value: 1 },
    { label: 'High', value: 2 },
  ],
};

function App() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [prediction, setPrediction] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProductivity, setSelectedProductivity] = useState(0);
  const [selectedWillingnessToLearn, setSelectedWillingnessToLearn] = useState(0);
  const [selectedTemporalAvailability, setSelectedTemporalAvailability] = useState(0);

  const handleExamplePersonClick = (person: ExamplePerson) => {
    // Create a copy of the person's data
    const data = {...person.data};
    
    // Set the form data
    setFormData(data);
    
    // Update the special dropdown values
    // Set productivity value
    if (data.productivity_unproductive === 1) {
      setSelectedProductivity(0);
    } else if (data.productivity_productive === 1) {
      setSelectedProductivity(1);
    } else {
      setSelectedProductivity(2);
    }
    
    // Set willingness_to_learn value
    if (data.willingness_to_learn_ready === 1) {
      setSelectedWillingnessToLearn(1);
    } else if (data.willingness_to_learn_very_ready === 1) {
      setSelectedWillingnessToLearn(2);
    } else {
      setSelectedWillingnessToLearn(0);
    }
    
    // Set temporal_availability value
    if (data.temporal_availability_low === 1) {
      setSelectedTemporalAvailability(0);
    } else if (data.temporal_availability_medium === 1) {
      setSelectedTemporalAvailability(1);
    } else {
      setSelectedTemporalAvailability(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      //const response = await fetch('http://127.0.0.1:8080/predict', {
      const response = await fetch('https://mindfuel-application-backend-982244428745.europe-west1.run.app/predict', {

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
      setPrediction(data.hired_probability);
    } catch (err) {
      setError('Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'productivity') {
      setSelectedProductivity(Number(value));
      if (Number(value) === 0) {
        setFormData(prev => ({
          ...prev,
          productivity_unproductive: 1,
          productivity_productive: 0,
        }));
      } else if (Number(value) === 1) {
        setFormData(prev => ({
          ...prev,
          productivity_unproductive: 0,
          productivity_productive: 1,
        }));
      } else if (Number(value) === 2) {
        setFormData(prev => ({
          ...prev,
          productivity_unproductive: 0,
          productivity_productive: 0,
        }));
      }
    } else if (name === 'willingness_to_learn') {
      setSelectedWillingnessToLearn(Number(value));
      if (Number(value) === 0) {
        setFormData(prev => ({
          ...prev,
          willingness_to_learn_ready: 0,
          willingness_to_learn_very_ready: 0,
        }));
      } else if (Number(value) === 1) {
        setFormData(prev => ({
          ...prev,
          willingness_to_learn_ready: 1,
          willingness_to_learn_very_ready: 0,
        }));
      } else if (Number(value) === 2) {
        setFormData(prev => ({
          ...prev,
          willingness_to_learn_ready: 0,
          willingness_to_learn_very_ready: 1,
        }));
      }
    } else if (name === 'temporal_availability') {
      setSelectedTemporalAvailability(Number(value));
      if (Number(value) === 0) {
        setFormData(prev => ({
          ...prev,
          temporal_availability_low: 1,
          temporal_availability_medium: 0,
        }));
      } else if (Number(value) === 1) {
        setFormData(prev => ({
          ...prev,
          temporal_availability_low: 0,
          temporal_availability_medium: 1,
        }));
      } else if (Number(value) === 2) {
        setFormData(prev => ({
          ...prev,
          temporal_availability_low: 0,
          temporal_availability_medium: 0,
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: Number(value),
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Hired Prediction</h1>
          <p className="text-lg text-gray-600">
            Enter application data to predict hiring probability
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-medium text-gray-900 mb-6 text-center">Example Persons</h2>
          <div className="grid grid-cols-3 gap-8">
            {examplePersons.map((person) => (
              <button
                key={person.name}
                onClick={() => handleExamplePersonClick(person)}
                className="p-6 border rounded-xl hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105 hover:shadow-lg"
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500">
                    <img 
                      src={person.imagePath} 
                      alt={person.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/150';
                      }}
                    />
                  </div>
                  <p className="font-medium text-lg text-gray-900">{person.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white p-8 rounded-xl shadow-sm space-y-6">
            {Object.entries(formData).map(([key, value]) => {
              if (key === 'productivity_unproductive' || key === 'productivity_productive' || key === 'willingness_to_learn_ready' || key === 'willingness_to_learn_very_ready' || key === 'temporal_availability_low' || key === 'temporal_availability_medium') {
                return null;
              }
              return (
                <div key={key} className="mb-6">
                  <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-2">
                    {key
                      .split('_')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                  </label>
                  <select
                    name={key}
                    id={key}
                    value={value}
                    onChange={handleDropdownChange}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    {dropdownOptions[key]?.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}

            <div className="mb-6">
              <label htmlFor="productivity" className="block text-sm font-medium text-gray-700 mb-2">
                Productivity
              </label>
              <select
                name="productivity"
                id="productivity"
                value={selectedProductivity}
                onChange={handleDropdownChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {dropdownOptions.productivity.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label htmlFor="temporal_availability" className="block text-sm font-medium text-gray-700 mb-2">
                Temporal Availability
              </label>
              <select
                name="temporal_availability"
                id="temporal_availability"
                value={selectedTemporalAvailability}
                onChange={handleDropdownChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {dropdownOptions.temporal_availability.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label htmlFor="willingness_to_learn" className="block text-sm font-medium text-gray-700 mb-2">
                Willingness To Learn
              </label>
              <select
                name="willingness_to_learn"
                id="willingness_to_learn"
                value={selectedWillingnessToLearn}
                onChange={handleDropdownChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {dropdownOptions.willingness_to_learn.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
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
            {loading ? 'Predicting...' : 'Predict hiring probability'}
          </button>
        </form>

        {prediction !== null && !error && (
          <div className={`mt-8 p-4 rounded-md ${!prediction ? 'bg-red-50' : 'bg-green-50'}`}>
            <p className={`text-lg font-semibold ${!prediction ? 'text-red-800' : 'text-green-800'}`}>
              {!prediction ? 'Applicant should not be hired' : 'Applicant should be hired'}
            </p>
          </div>
        )}
      </div>

      <footer className="mt-12 text-center text-gray-500">
        <p>#alwaysstaymindfuel</p>
      </footer>
    </div>
  );
}

export default App;
