# 🐳 Whale Wacther

A hybrid Web3 dashboard that tracks high-net-worth wallet activity and contextualises it with real-time news, using Moralis API.

[Live Demo](https://whale-watcher-2yt1.onrender.com/])

🚀 Why I Built This

On-chain data tells you what is happening, but it doesn't tell you why.

I built Whale Watcher to bridge that gap. By combining the Moralis API (for instant blockchain indexing) with a custom News Aggregator (for off chain intelligence), this dashboard gives traders a complete picture of a wallet's activity.

⚡ Tech Stack
- Frontend: React.js, Vite, Tailwind CSS, Lucide Icons
- Web3 Data: [Moralis API](https://moralis.com/) (Real time Token Balances & Metadata)
- Hybrid Backend: Python (Flask)

🛠️ Quick Start (Local)
This project uses a microservices architecture. You need to run the React Frontend and the Python Backend simultaneously.

1. Clone & Setup
```
git clone [https://github.com/lakshay-nasa/whale-watcher.git](https://github.com/lakshay-nasa/whale-watcher.git)
cd whale-watcher
```

2. Frontend (React)
```
npm install
# Create a .env file in root and add your Key: VITE_MORALIS_KEY=your_key
npm run dev
```

***Built by [Lakshay Nasa](https://www.linkedin.com/in/lakshaynasa/).***