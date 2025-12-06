import os
from flask import Flask, request, jsonify
from flask_cors import CORS

try:
    from backend.scraper import scrape_news
except ImportError:
    from scraper import scrape_news

app = Flask(__name__)

# Enable CORS so our  React Frontend can talk to this Backend
CORS(app)

@app.route('/news', methods=['GET'])
def get_news():
    token_name = request.args.get('token')
    
    # Validation
    if not token_name:
        return jsonify({"error": "Missing 'token' parameter"}), 400

    # Call the Scraper
    try:
        news_items = scrape_news(token_name)
    except Exception as e:
        print(f"Server Error: {e}")
        return jsonify({"error": "Failed to fetch news", "details": str(e)}), 500
    
    # Return JSON
    return jsonify({
        "token": token_name,
        "source": "CoinTelegraph",
        "headlines": news_items
    })

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    print(f"🚀 Whale Backend running on port {port}")
    
    # 'host=0.0.0.0' is required for the container to be accessible externally
    app.run(host='0.0.0.0', port=port)