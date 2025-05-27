
from flask import Flask, request, jsonify
from summarizer import summarize_article

app = Flask(__name__)

@app.route("/")
def home():
    return {"status": "BSNS MCP API is running"}

@app.route("/summarize", methods=["POST"])
def summarize():
    data = request.get_json()
    url = data.get("url")
    if not url:
        return jsonify({"error": "Missing URL"}), 400
    
    try:
        summary = summarize_article(url)
        return jsonify({"summary": summary})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
