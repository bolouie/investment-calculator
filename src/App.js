import React, { useState } from 'react';
import {
  Calculator,
  TrendingUp,
  PieChart,
  DollarSign,
  Percent,
  Calendar,
} from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('stock');

  // Stock Calculator State
  const [stockInputs, setStockInputs] = useState({
    investment: '',
    currentPrice: '',
    targetPrice: '',
    dividend: '',
    dividendFreq: 'quarterly',
    peRatio: '',
    industryPE: '',
    timeHorizon: '',
    ticker: '',
  });

  const [stockLoading, setStockLoading] = useState(false);

  // ETF Calculator State
  const [etfInputs, setEtfInputs] = useState({
    investment: '',
    currentPrice: '',
    mer: '',
    dividend: '',
    dividendFreq: 'quarterly',
    benchmarkReturn: '',
    timeHorizon: '',
    ticker: '',
  });

  const [etfLoading, setEtfLoading] = useState(false);

  // Fetch stock price from API
  const fetchStockPrice = async (ticker, isETF = false) => {
    if (!ticker.trim()) {
      alert('Please enter a ticker symbol');
      return;
    }

    const setLoading = isETF ? setEtfLoading : setStockLoading;
    const setInputs = isETF ? setEtfInputs : setStockInputs;
    const inputs = isETF ? etfInputs : stockInputs;

    setLoading(true);

    try {
      // Using Financial Modeling Prep API (free tier: 250 calls/day)
      const response = await fetch(
        `https://financialmodelingprep.com/api/v3/quote/${ticker}?apikey=demo`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch stock price');
      }

      const data = await response.json();
      
      if (!data || data.length === 0 || !data[0].price) {
        throw new Error(`No price data found for ${ticker}`);
      }

      const price = data[0].price;
      
      setInputs({
        ...inputs,
        currentPrice: price.toString(),
        ticker: '',
      });

      alert(`Price for ${ticker}: $${price}`);
    } catch (error) {
      console.error('Error fetching stock price:', error);
      alert(`Error fetching price for ${ticker}. Please check the ticker symbol and try again.`);
    } finally {
      setLoading(false);
    }
  };

  const calculateStock = () => {
    const investment = parseFloat(stockInputs.investment) || 0;
    const currentPrice = parseFloat(stockInputs.currentPrice) || 0;
    const targetPrice = parseFloat(stockInputs.targetPrice) || 0;
    const dividend = parseFloat(stockInputs.dividend) || 0;
    const timeHorizon = parseFloat(stockInputs.timeHorizon) || 1;
    const shares = currentPrice > 0 ? investment / currentPrice : 0;

    // Calculate dividend income
    const divMultiplier =
      stockInputs.dividendFreq === 'monthly'
        ? 12
        : stockInputs.dividendFreq === 'quarterly'
        ? 4
        : 1;
    const annualDividend = dividend * divMultiplier;
    const totalDividends = shares * annualDividend * timeHorizon;

    // Calculate capital gains
    const capitalGains = shares * (targetPrice - currentPrice);
    const totalReturn = capitalGains + totalDividends;
    const totalValue = investment + totalReturn;
    const annualizedReturn =
      timeHorizon > 0
        ? (Math.pow(totalValue / investment, 1 / timeHorizon) - 1) * 100
        : 0;

    return {
      shares: shares.toFixed(2),
      capitalGains: capitalGains.toFixed(2),
      totalDividends: totalDividends.toFixed(2),
      totalReturn: totalReturn.toFixed(2),
      totalValue: totalValue.toFixed(2),
      annualizedReturn: annualizedReturn.toFixed(2),
      peAnalysis:
        stockInputs.peRatio && stockInputs.industryPE
          ? parseFloat(stockInputs.peRatio) < parseFloat(stockInputs.industryPE)
            ? 'Undervalued'
            : 'Overvalued'
          : 'N/A',
    };
  };

  const calculateETF = () => {
    const investment = parseFloat(etfInputs.investment) || 0;
    const currentPrice = parseFloat(etfInputs.currentPrice) || 0;
    const mer = parseFloat(etfInputs.mer) || 0;
    const dividend = parseFloat(etfInputs.dividend) || 0;
    const benchmarkReturn = parseFloat(etfInputs.benchmarkReturn) || 0;
    const timeHorizon = parseFloat(etfInputs.timeHorizon) || 1;
    const shares = currentPrice > 0 ? investment / currentPrice : 0;

    // Calculate dividend income
    const divMultiplier =
      etfInputs.dividendFreq === 'monthly'
        ? 12
        : etfInputs.dividendFreq === 'quarterly'
        ? 4
        : 1;
    const annualDividend = dividend * divMultiplier;
    const totalDividends = shares * annualDividend * timeHorizon;

    // Calculate projected returns (benchmark return minus MER)
    const netReturn = (benchmarkReturn - mer) / 100;
    const projectedValue = investment * Math.pow(1 + netReturn, timeHorizon);
    const capitalGains = projectedValue - investment;
    const totalReturn = capitalGains + totalDividends;
    const annualMERCost = ((investment * mer) / 100) * timeHorizon;

    return {
      shares: shares.toFixed(2),
      capitalGains: capitalGains.toFixed(2),
      totalDividends: totalDividends.toFixed(2),
      totalReturn: totalReturn.toFixed(2),
      projectedValue: projectedValue.toFixed(2),
      annualMERCost: annualMERCost.toFixed(2),
      netAnnualReturn: (netReturn * 100).toFixed(2),
    };
  };

  const stockResults = calculateStock();
  const etfResults = calculateETF();

  return (
    <div className='max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen'>
      <div className='text-center mb-8'>
        <h1 className='text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3'>
          <Calculator className='text-blue-600' />
          Investment Analysis Tools
        </h1>
        <p className='text-gray-600 text-lg'>
          Professional calculators for stock and ETF evaluation
        </p>
      </div>

      {/* Tab Navigation */}
      <div className='flex justify-center mb-8'>
        <div className='bg-white rounded-lg p-1 shadow-lg'>
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-6 py-3 rounded-md flex items-center gap-2 font-medium transition-all ${
              activeTab === 'stock'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <TrendingUp size={20} />
            Stock Calculator
          </button>
          <button
            onClick={() => setActiveTab('etf')}
            className={`px-6 py-3 rounded-md flex items-center gap-2 font-medium transition-all ${
              activeTab === 'etf'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <PieChart size={20} />
            ETF Calculator
          </button>
        </div>
      </div>

      {activeTab === 'stock' && (
        <div className='grid lg:grid-cols-2 gap-8'>
          {/* Stock Inputs */}
          <div className='bg-white rounded-xl shadow-lg p-6'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
              <DollarSign className='text-green-600' />
              Stock Analysis Inputs
            </h2>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Investment Amount ($)
                </label>
                <input
                  type='number'
                  value={stockInputs.investment}
                  onChange={(e) =>
                    setStockInputs({
                      ...stockInputs,
                      investment: e.target.value,
                    })
                  }
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  placeholder='10000'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Ticker Symbol (e.g., AAPL, SHOP.TO)
                </label>
                <div className='flex gap-2'>
                  <input
                    type='text'
                    value={stockInputs.ticker}
                    onChange={(e) =>
                      setStockInputs({
                        ...stockInputs,
                        ticker: e.target.value.toUpperCase(),
                      })
                    }
                    className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    placeholder='AAPL'
                  />
                  <button
                    type='button'
                    onClick={() => fetchStockPrice(stockInputs.ticker, false)}
                    disabled={stockLoading || !stockInputs.ticker.trim()}
                    className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium'
                  >
                    {stockLoading ? 'Loading...' : 'Get Price'}
                  </button>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Current Price ($)
                  </label>
                  <input
                    type='number'
                    value={stockInputs.currentPrice}
                    onChange={(e) =>
                      setStockInputs({
                        ...stockInputs,
                        currentPrice: e.target.value,
                      })
                    }
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    placeholder='150'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Target Price ($)
                  </label>
                  <input
                    type='number'
                    value={stockInputs.targetPrice}
                    onChange={(e) =>
                      setStockInputs({
                        ...stockInputs,
                        targetPrice: e.target.value,
                      })
                    }
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    placeholder='180'
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Dividend per Share ($)
                  </label>
                  <input
                    type='number'
                    value={stockInputs.dividend}
                    onChange={(e) =>
                      setStockInputs({
                        ...stockInputs,
                        dividend: e.target.value,
                      })
                    }
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    placeholder='0.75'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Dividend Frequency
                  </label>
                  <select
                    value={stockInputs.dividendFreq}
                    onChange={(e) =>
                      setStockInputs({
                        ...stockInputs,
                        dividendFreq: e.target.value,
                      })
                    }
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  >
                    <option value='quarterly'>Quarterly</option>
                    <option value='monthly'>Monthly</option>
                    <option value='annual'>Annual</option>
                  </select>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    P/E Ratio
                  </label>
                  <input
                    type='number'
                    value={stockInputs.peRatio}
                    onChange={(e) =>
                      setStockInputs({
                        ...stockInputs,
                        peRatio: e.target.value,
                      })
                    }
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    placeholder='22.5'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Industry Avg P/E
                  </label>
                  <input
                    type='number'
                    value={stockInputs.industryPE}
                    onChange={(e) =>
                      setStockInputs({
                        ...stockInputs,
                        industryPE: e.target.value,
                      })
                    }
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    placeholder='25.0'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Time Horizon (years)
                </label>
                <input
                  type='number'
                  value={stockInputs.timeHorizon}
                  onChange={(e) =>
                    setStockInputs({
                      ...stockInputs,
                      timeHorizon: e.target.value,
                    })
                  }
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  placeholder='3'
                />
              </div>
            </div>
          </div>

          {/* Stock Results */}
          <div className='bg-white rounded-xl shadow-lg p-6'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
              <TrendingUp className='text-blue-600' />
              Analysis Results
            </h2>

            <div className='space-y-4'>
              <div className='bg-gray-50 rounded-lg p-4'>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-gray-600'>Shares Purchased:</span>
                  <span className='font-semibold'>{stockResults.shares}</span>
                </div>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-gray-600'>Capital Gains:</span>
                  <span
                    className={`font-semibold ${
                      parseFloat(stockResults.capitalGains) >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    ${stockResults.capitalGains}
                  </span>
                </div>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-gray-600'>Total Dividends:</span>
                  <span className='font-semibold text-green-600'>
                    ${stockResults.totalDividends}
                  </span>
                </div>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-gray-600'>Total Return:</span>
                  <span
                    className={`font-semibold ${
                      parseFloat(stockResults.totalReturn) >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    ${stockResults.totalReturn}
                  </span>
                </div>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-gray-600'>Total Value:</span>
                  <span className='font-bold text-lg'>
                    ${stockResults.totalValue}
                  </span>
                </div>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-gray-600'>Annualized Return:</span>
                  <span
                    className={`font-semibold ${
                      parseFloat(stockResults.annualizedReturn) >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {stockResults.annualizedReturn}%
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600'>Valuation:</span>
                  <span
                    className={`font-semibold ${
                      stockResults.peAnalysis === 'Undervalued'
                        ? 'text-green-600'
                        : stockResults.peAnalysis === 'Overvalued'
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {stockResults.peAnalysis}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'etf' && (
        <div className='grid lg:grid-cols-2 gap-8'>
          {/* ETF Inputs */}
          <div className='bg-white rounded-xl shadow-lg p-6'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
              <PieChart className='text-purple-600' />
              ETF Analysis Inputs
            </h2>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Investment Amount ($)
                </label>
                <input
                  type='number'
                  value={etfInputs.investment}
                  onChange={(e) =>
                    setEtfInputs({ ...etfInputs, investment: e.target.value })
                  }
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
                  placeholder='10000'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Ticker Symbol (e.g., VTI, XEQT.TO)
                </label>
                <div className='flex gap-2'>
                  <input
                    type='text'
                    value={etfInputs.ticker}
                    onChange={(e) =>
                      setEtfInputs({
                        ...etfInputs,
                        ticker: e.target.value.toUpperCase(),
                      })
                    }
                    className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
                    placeholder='VTI'
                  />
                  <button
                    type='button'
                    onClick={() => fetchStockPrice(etfInputs.ticker, true)}
                    disabled={etfLoading || !etfInputs.ticker.trim()}
                    className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium'
                  >
                    {etfLoading ? 'Loading...' : 'Get Price'}
                  </button>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Current Price ($)
                  </label>
                  <input
                    type='number'
                    value={etfInputs.currentPrice}
                    onChange={(e) =>
                      setEtfInputs({
                        ...etfInputs,
                        currentPrice: e.target.value,
                      })
                    }
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
                    placeholder='85'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    MER (%)
                  </label>
                  <input
                    type='number'
                    step='0.01'
                    value={etfInputs.mer}
                    onChange={(e) =>
                      setEtfInputs({ ...etfInputs, mer: e.target.value })
                    }
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
                    placeholder='0.65'
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Dividend per Share ($)
                  </label>
                  <input
                    type='number'
                    value={etfInputs.dividend}
                    onChange={(e) =>
                      setEtfInputs({ ...etfInputs, dividend: e.target.value })
                    }
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
                    placeholder='0.45'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Dividend Frequency
                  </label>
                  <select
                    value={etfInputs.dividendFreq}
                    onChange={(e) =>
                      setEtfInputs({
                        ...etfInputs,
                        dividendFreq: e.target.value,
                      })
                    }
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
                  >
                    <option value='quarterly'>Quarterly</option>
                    <option value='monthly'>Monthly</option>
                    <option value='annual'>Annual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Expected Benchmark Return (%)
                </label>
                <input
                  type='number'
                  value={etfInputs.benchmarkReturn}
                  onChange={(e) =>
                    setEtfInputs({
                      ...etfInputs,
                      benchmarkReturn: e.target.value,
                    })
                  }
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
                  placeholder='8.5'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Time Horizon (years)
                </label>
                <input
                  type='number'
                  value={etfInputs.timeHorizon}
                  onChange={(e) =>
                    setEtfInputs({ ...etfInputs, timeHorizon: e.target.value })
                  }
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
                  placeholder='5'
                />
              </div>
            </div>
          </div>

          {/* ETF Results */}
          <div className='bg-white rounded-xl shadow-lg p-6'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
              <Percent className='text-purple-600' />
              Analysis Results
            </h2>

            <div className='space-y-4'>
              <div className='bg-gray-50 rounded-lg p-4'>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-gray-600'>Shares Purchased:</span>
                  <span className='font-semibold'>{etfResults.shares}</span>
                </div>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-gray-600'>
                    Projected Capital Gains:
                  </span>
                  <span
                    className={`font-semibold ${
                      parseFloat(etfResults.capitalGains) >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    ${etfResults.capitalGains}
                  </span>
                </div>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-gray-600'>Total Dividends:</span>
                  <span className='font-semibold text-green-600'>
                    ${etfResults.totalDividends}
                  </span>
                </div>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-gray-600'>Total Return:</span>
                  <span
                    className={`font-semibold ${
                      parseFloat(etfResults.totalReturn) >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    ${etfResults.totalReturn}
                  </span>
                </div>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-gray-600'>Projected Value:</span>
                  <span className='font-bold text-lg'>
                    ${etfResults.projectedValue}
                  </span>
                </div>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-gray-600'>Net Annual Return:</span>
                  <span
                    className={`font-semibold ${
                      parseFloat(etfResults.netAnnualReturn) >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {etfResults.netAnnualReturn}%
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600'>Total MER Cost:</span>
                  <span className='font-semibold text-red-600'>
                    ${etfResults.annualMERCost}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Factors Guide */}
      <div className='mt-12 bg-white rounded-xl shadow-lg p-6'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
          <Calendar className='text-indigo-600' />
          Key Investment Factors to Consider
        </h2>

        <div className='grid md:grid-cols-2 gap-6'>
          <div>
            <h3 className='text-lg font-semibold text-gray-800 mb-3'>
              For Stocks:
            </h3>
            <ul className='space-y-2 text-gray-600'>
              <li>
                • <strong>P/E Ratio:</strong> Compare to industry average for
                valuation
              </li>
              <li>
                • <strong>Dividend Yield:</strong> Regular income component
              </li>
              <li>
                • <strong>Growth Rate:</strong> Historical and projected
                earnings growth
              </li>
              <li>
                • <strong>Financial Health:</strong> Debt-to-equity, ROE, profit
                margins
              </li>
              <li>
                • <strong>Market Position:</strong> Competitive advantages and
                moats
              </li>
            </ul>
          </div>

          <div>
            <h3 className='text-lg font-semibold text-gray-800 mb-3'>
              For ETFs:
            </h3>
            <ul className='space-y-2 text-gray-600'>
              <li>
                • <strong>MER (Expense Ratio):</strong> Annual fee that reduces
                returns
              </li>
              <li>
                • <strong>Tracking Error:</strong> How closely it follows the
                benchmark
              </li>
              <li>
                • <strong>Liquidity:</strong> Daily trading volume and bid-ask
                spreads
              </li>
              <li>
                • <strong>Diversification:</strong> Number and concentration of
                holdings
              </li>
              <li>
                • <strong>Tax Efficiency:</strong> Distribution structure and
                tax implications
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
