import React from 'react';
import { Newspaper, Loader2, ExternalLink } from 'lucide-react';

const TokenRow = ({ token, fetchNews, newsData, newsLoading }) => {
  
  // 1. Format Balance (e.g. 1.5M)
  const formatCompact = (balance, decimals) => {
    const num = balance / (10 ** decimals);
    return new Intl.NumberFormat('en-US', {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 2
    }).format(num);
  };

  // 2. Format Currency (e.g. $1,200.00)
  const formatMoney = (val) => {
    if (!val || val === 0) return "$0.00";
    
    // If value is very small (less than 1 cent), show more decimals
    if (val < 0.01) {
       return "$" + val.toFixed(10);
    }

    // Otherwise standard currency formatting
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(val);
  };

  const isLoading = newsLoading === token.symbol;

  return (
    <div className="token-wrapper">
      <div className="token-row">
        <div className="token-info">
          <div className="token-symbol">{token.symbol || "?"}</div>
          <div className="token-name">{token.name || "Unknown"}</div>
        </div>
        
        <div className="token-financials">
           <div className="token-value">
            {formatMoney(token.usd_value)}
          </div>
          <div className="token-details">
            <span className="detail-price">@{formatMoney(token.usd_price)}</span>
            <span className="detail-dot">•</span>
            <span className="detail-balance">
              {formatCompact(token.balance, token.decimals)} {token.symbol}
            </span>
          </div>
        </div>

        <div className="token-actions">
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

      {newsData && (
        <div className="news-dropdown">
          <div className="news-header">
            Latest Headlines for {token.symbol}:
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