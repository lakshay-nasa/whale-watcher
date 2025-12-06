import React, { useState } from "react";
import axios from "axios";
import { Search, Wallet, Coins, Activity, AlertCircle, Code2 } from "lucide-react";
import TokenRow from "./components/TokenRow";
import "./App.css";

const App = () => {
  const [address, setAddress] = useState("");
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const [news, setNews] = useState({});
  const [newsLoading, setNewsLoading] = useState(null); 

  const MORALIS_API_KEY = import.meta.env.VITE_MORALIS_KEY;
  // const PYTHON_BACKEND_URL = "http://localhost:5000/news";
  const PYTHON_BACKEND_URL = import.meta.env.VITE_BACKEND_URL 
  ? `${import.meta.env.VITE_BACKEND_URL}/news`  // Note: Render URL usually doesn't end in /news
  : "http://localhost:5000/news";
  
  const fetchTokenBalances = async () => {
    // 1. Validation
    if (!address || !address.startsWith("0x")) {
      alert("Please enter a valid wallet address (starts with 0x)");
      return;
    }

    if (!MORALIS_API_KEY) {
      setError("Missing API Key. Check your .env file.");
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(false);
    setNews({});
    setTokens([]);

    // 2. Call Moralis
    const endpoint = `https://deep-index.moralis.io/api/v2.2/${address}/erc20`;

    try {
      const resp = await axios.get(endpoint, {
        headers: {
          accept: "application/json",
          "X-API-Key": MORALIS_API_KEY,
        },
        params: { chain: "0x1" },
      });

      // 3. Filter Data
      const clean = Array.isArray(resp.data)
        ? resp.data.filter((t) => t.balance > 0 && !t.possible_spam)
        : [];

      setTokens(clean);
      setSearched(true);
    } catch (err) {
      console.error("Fetch tokens error:", err);
      if (err.response) {
        setError(`API Error: ${err.response.status} - ${err.response.statusText}`);
      } else {
        setError("Network error. Check console.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchNewsForToken = async (tokenName, tokenSymbol) => {
    if (news[tokenSymbol]) return;

    setNewsLoading(tokenSymbol);

    try {
      // 4. Call Python Backend
      const resp = await axios.get(PYTHON_BACKEND_URL, { 
        params: { token: tokenName } 
      });
      
      const headlines = resp.data.headlines || [];
      
      setNews((prev) => ({ 
        ...prev, 
        [tokenSymbol]: headlines 
      }));

    } catch (err) {
      console.error("News Error:", err);
      alert(`Could not fetch news. Is the Python backend running at ${PYTHON_BACKEND_URL}?`);
    } finally {
      setNewsLoading(null);
    }
  };

  // --- RENDER ---
  return (
    <div className="app-container">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <div className={`glass-card ${searched ? 'has-results' : ''}`}>
        <div className="header">
          <div className="icon-badge">
            <Activity size={24} color="#00d4ff" />
          </div>
          <h1>Whale Watcher</h1>
          <p>
            Scan address • View Assets • <span style={{ color: "#00d4ff" }}>AI News</span>
          </p>
        </div>

        {/* Search Input */}
        <div className="search-section">
          <div className="input-wrapper">
            <Wallet className="input-icon" size={20} />
            <input
              type="text"
              placeholder="Paste Wallet Address (0x...)"
              value={address}
              onChange={(e) => setAddress(e.target.value.trim())}
              onKeyDown={(e) => e.key === "Enter" && fetchTokenBalances()}
            />
          </div>
          <button onClick={fetchTokenBalances} disabled={loading}>
            {loading ? "Scanning..." : <><Search size={18} /> Scan</>}
          </button>
        </div>

        {error && (
          <div className="error-box">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Results Area */}
        {searched && !loading && (
          <div className="results-area">
            <div className="results-header">
              <Coins size={18} />
              <h3>Portfolio Holdings</h3>
              <span className="count-badge">{tokens.length} Assets Found</span>
            </div>

            {tokens.length === 0 ? (
              <div className="empty-state">This wallet holds no verified tokens.</div>
            ) : (
              <div className="token-list">
                {tokens.map((token, i) => (
                  <TokenRow
                    key={token.token_address || i}
                    token={token}
                    fetchNews={fetchNewsForToken}
                    newsData={news[token.symbol]}
                    newsLoading={newsLoading}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="footer-credit">
          <Code2 size={14} />
          <span>Powered by <strong>Moralis API</strong></span>
        </div>

      </div>
    </div>
  );
};

export default App;