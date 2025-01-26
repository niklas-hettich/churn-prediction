from flask import Flask, request, jsonify
from flask_cors import CORS
from joblib import load
import numpy as np
import os

app = Flask(__name__)
CORS(app)

model = load('randomForest.joblib')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json

        
        features = np.array([[
            data['motivation'],
            data['working_independently'],
            data['teamplayer'],
            data['solution_oriented'],
            data['age'],
            data['productivity_productive'],
            data['productivity_unproductive'],
            data['willingness_to_learn_ready'],
            data['willingness_to_learn_very_ready'],
            data['temporal_availability_low'],
            data['temporal_availability_medium'],
        ]])
        
        print("features: ",features)
        
        prediction = model.predict(features)[0]
        
        return jsonify({
            'prediction': int(prediction),
            'hired_probability': bool(prediction)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/health', methods=['GET'])
def health():
    return "Ok", 200

# if __name__ == '__main__':
#    app.run(debug=True)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)