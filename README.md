# VisionTrade - AI-Powered Trading Dashboard

VisionTrade is a futuristic, open-source trading dashboard built with Next.js and powered by Google's Gemini AI. It provides traders with a modern, intuitive interface for market analysis, real-time data visualization, and AI-driven insights.

## ✨ Key Features

- **Modern UI/UX:** A sleek, glassmorphic design built with Tailwind CSS and ShadCN UI.
- **Real-Time Charts:** Interactive TradingView charts for comprehensive technical analysis.
- **AI-Powered Insights:**
    - **News Sentiment Analysis:** Get on-demand sentiment analysis (Positive, Negative, Neutral) for any news article.
    - **AI Stock Summary:** Generate a concise summary, recommendation (BUY/SELL/HOLD), and reasoning for any stock.
    - **AI Chat Assistant:** Engage in a conversation with an AI expert about specific stocks or market trends.
- **Global News Aggregator:** Scrapes real-time news from MarketWatch to keep you updated.
- **Multi-Market Support:** Switch seamlessly between US Stocks, Indian Market, and Forex.
- **Toggleable AI:** AI features can be toggled on or off, allowing the platform to be used as a standard trading dashboard.
- **Responsive Design:** Fully functional on both desktop and mobile devices.

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **AI Integration:** [Google AI Gemini via Genkit](https://ai.google.dev/genkit)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)

## 🛠️ Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/visiontrade.git
    cd visiontrade
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of your project and add your Google AI API key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

    ```.env
    GOOGLE_API_KEY=your_google_ai_api_key
    ```
    *Note: Genkit uses this variable. Some Genkit examples might refer to `GOOGLE_GENERATIVE_AI_API_KEY`. `GOOGLE_API_KEY` takes precedence.*


4.  **Run the development server:**

    The application requires two separate processes to run concurrently: the Next.js frontend and the Genkit AI server.

    - **Terminal 1: Run the Next.js App**
      ```sh
      npm run dev
      ```
      This will start the web application, typically on `http://localhost:9002`.

    - **Terminal 2: Run the Genkit AI Server**
      ```sh
      npm run genkit:watch
      ```
      This starts the Genkit server in watch mode, which provides the AI functionalities.

5.  **Open the application:**
    Navigate to `http://localhost:9002` in your browser to see the application in action.

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improving VisionTrade, please feel free to fork the repository and submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
