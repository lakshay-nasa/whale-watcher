import React from 'react';
import { ArrowRight, Newspaper, Loader2, ExternalLink } from 'lucide-react';

const TokenRow = ({ token, fetchNews, newsData, newsLoading }) => {
  
  // Helper to format balances nicely
  
  // Function 1: Compact version for the visual list (e.g. "1.5M")
  const formatCompact = (balance, decimals) => {
    const num = balance / (10 ** decimals);
    return new Intl.NumberFormat('en-US', {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 2
    }).format(num);
  };

  // Function 2: Full version for the hover tooltip (e.g. "1,500,000.00")
  const formatFull = (balance, decimals) => {
    const num = balance / (10 ** decimals);
    return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
  };

  const isLoading = newsLoading === token.symbol;

  return (
    <div className="token-wrapper">
      <div className="token-row">
        <div className="token-info">
          <div className="token-symbol">{token.symbol || "?"}</div>
          <div className="token-name">{token.name || "Unknown"}</div>
        </div>
        
        <div className="token-actions">
          
          <div 
            className="token-balance" 
            title={formatFull(token.balance, token.decimals)} /* Shows full number on hover */
          >
            {formatCompact(token.balance, token.decimals)}    {/* Shows short number on screen */}
          </div>

          <button 
            className="news-btn"
            onClick={() => fetchNews(token.name, token.symbol)}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 size={14} className="spin" />
            ) : (
              <Newspaper size={14} />
            )}
            <span className="btn-text">News</span>
          </button>
        </div>
      </div>

      {/* News Dropdown code... */}
      {newsData && (
        <div className="news-dropdown">
          <div className="news-header">
            Latest Headlines:
          </div>
          
          {newsData.length === 0 ? (
            <div className="news-item">No recent news found for this token.</div>
          ) : (
            newsData.map((article, i) => (
              <a 
                key={i} 
                href={article.url} 
                target="_blank" 
                rel="noreferrer" 
                className="news-item"
              >
                <span>{article.title}</span>
                <ExternalLink size={12} style={{opacity: 0.7}} />
              </a>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TokenRow;