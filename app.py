rom flask import Flask, request, jsonify, render_template
import pickle

app = Flask(__name__)

# Load model
model = pickle.load(open("model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    text = data['text']

    vec = vectorizer.transform([text])
    pred = model.predict(vec)[0]
    prob = model.predict_proba(vec)[0].max()

    return jsonify({
        "result": "FAKE" if pred == 0 else "REAL",
        "confidence": round(float(prob)*100, 2)
    })

if __name__ == "__main__":
    app.run(debug=True)
