import requests
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv

# Load the backend .env file
load_dotenv()
ZYTE_API_KEY = os.getenv("ZYTE_API_KEY")

def get_html(url):
    if not ZYTE_API_KEY:
        print("❌ Error: API_KEY is missing in backend/.env")
        return None

    print(f"🌍 Fetching: {url}")
    
    try:
        response = requests.post(
            'https://api.zyte.com/v1/extract',
            auth=(ZYTE_API_KEY, ''), # Basic Auth
            json={
                "url": url,
                "browserHtml": True, # Use a real browser to render JS
            },
            timeout=60
        )
        
        if response.status_code == 200:
            return response.json().get('browserHtml')
        else:
            print(f"Request Error: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print(f"Request Failed: {e}")
        return None

def scrape_news(token_name):
    print(f"🦈 Hunting news for: {token_name}...")
    
    # Map token names to CoinTelegraph tags
    # Example: "Wrapped BTC" -> "bitcoin"
    search_term = token_name.lower().replace(" ", "-")
    
    # Common mappings to improve accuracy
    if "btc" in search_term or "bitcoin" in search_term: search_term = "bitcoin"
    elif "eth" in search_term or "ethereum" in search_term: search_term = "ethereum"
    elif "usdc" in search_term: search_term = "usd-coin"
    elif "usdt" in search_term: search_term = "tether"
    
    url = f"https://cointelegraph.com/tags/{search_term}"
    
    # 1. GET HTML
    html_content = get_html(url)
    
    if not html_content:
        return []

    # 2. PARSE WITH SOUP
    soup = BeautifulSoup(html_content, 'html.parser')
    headlines = []
    
    articles = soup.select('.post-card-inline__title')[:3]
    
    for article in articles:
        title = article.get_text().strip()
        parent_link = article.find_parent('a')
        link = "https://cointelegraph.com" + parent_link['href'] if parent_link else "#"
        headlines.append({"title": title, "url": link})
        
    return headlines