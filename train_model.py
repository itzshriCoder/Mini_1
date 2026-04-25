import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import pickle

print("Loading data...")
# Load data
df = pd.read_csv("news.csv")

# CLEAN THE DATA: Drop any rows that are completely empty
df = df.dropna(subset=['text', 'label'])
# Ensure all text is treated as a string
X = df['text'].astype(str)
y = df['label'].astype(int)

print(f"Training on {len(df)} articles...")

# Convert text → numbers
vectorizer = TfidfVectorizer(stop_words='english', max_df=0.7)
X_vec = vectorizer.fit_transform(X)

# Train model
model = LogisticRegression(C=1.0)
model.fit(X_vec, y)

# Save model
pickle.dump(model, open("model.pkl", "wb"))
pickle.dump(vectorizer, open("vectorizer.pkl", "wb"))

print("Model trained and saved successfully!")
