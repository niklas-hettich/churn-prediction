from flask import Flask, request, jsonify
from flask_cors import CORS
from joblib import load
import numpy as np
import os

app = Flask(__name__)
CORS(app)

model = load('adaboost_model.joblib')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        features = np.array([[
            data['callFailure'],
            data['complains'],
            data['subscriptionLength'],
            data['chargeAmount'],
            data['secondsOfUse'],
            data['frequencyOfUse'],
            data['frequencyOfSMS'],
            data['distinctCalledNumbers'],
            data['ageGroup'],
            data['tariffPlan'],
            data['status'],
            data['age'],
            data['customerValue']
        ]])
        
        prediction = model.predict(features)[0]
        
        return jsonify({
            'prediction': int(prediction),
            'churn_probability': bool(prediction)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/health', methods=['GET'])
def health():
    return "Ok", 200

# if __name__ == '__main__':
#    app.run(debug=True)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)