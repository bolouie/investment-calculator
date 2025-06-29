# CLAUDE.md

# Investment Calculator - Real-Time Price Integration

## Project Overview
Professional investment analysis tools for **both stocks and ETFs** with dual calculator interface. Currently uses manual price entry, needs real-time market data integration while preserving the complete dual-calculator functionality.

## Current Status
- ✅ **Working**: Complete stock calculator with P/E analysis and dividend projections
- ✅ **Working**: Complete ETF calculator with MER analysis and benchmark returns  
- ✅ **Working**: Tab-based UI switching between Stock and ETF calculators
- ✅ **Working**: All calculation logic for returns, dividends, valuation analysis
- ✅ **Updated**: Node 24.3 and React 19
- 🔄 **Needs Implementation**: Real-time price lookup for BOTH calculators

## Feature Request: Add Price Lookup to Both Calculators

### Current Implementation
Both calculators require manual price entry:
- **Stock Calculator**: Manual current price and target price entry
- **ETF Calculator**: Manual current price entry
- **No API integration**: Users must look up prices separately

### Goal
Add real-time price lookup to **both calculators** that:
1. **Preserves existing dual-calculator UI** (Stock/ETF tabs)
2. **Adds ticker input + "Get Price" button** to both calculators
3. **Auto-fills current price field** when API call succeeds
4. **Maintains all existing functionality** (calculations, validation, etc.)
5. **Works for both stocks and ETFs** across multiple exchanges

## Technical Requirements

### UI Integration
- **Add ticker symbol field** to both Stock and ETF calculator forms
- **Add "Get Price" button** next to current price fields
- **Maintain existing form layout** and responsive design
- **Keep tab switching** between Stock/ETF calculators working
- **Preserve all current input fields** and calculations

### API Specifications
- **Canadian stocks/ETFs**: Support .TO suffix (e.g., XEQT.TO, SHOP.TO)
- **US stocks/ETFs**: Standard tickers (e.g., AAPL, VTI, MSFT)
- **Response format**: JSON with price data
- **Integration**: Add to existing React state management
- **Error handling**: Graceful fallbacks with helpful messages

### Current Architecture
```javascript
// Two separate calculators with state management
const [activeTab, setActiveTab] = useState('stock');
const [stockInputs, setStockInputs] = useState({...});
const [etfInputs, setEtfInputs] = useState({...});

## Implementation Plan

### Phase 1: Add Ticker Fields
- Add ticker symbol input to both calculator forms
- Add "Get Price" button with loading states
- Maintain existing form styling and layout

### Phase 2: API Integration  
- Implement `fetchStockPrice` function
- Update both `stockInputs.currentPrice` and `etfInputs.currentPrice`
- Handle success/error states appropriately

### Phase 3: Enhanced UX
- Auto-clear ticker field after successful lookup
- Show ticker symbol in results section
- Add helpful hints for ticker format (.TO vs US)

## Critical Requirements

### Must Preserve
- ✅ **Both calculators** must remain fully functional
- ✅ **Tab switching** between Stock/ETF must work
- ✅ **All existing calculations** must remain unchanged
- ✅ **Responsive design** must be maintained
- ✅ **Current validation logic** must be preserved

### New Functionality
- 🆕 **Ticker symbol lookup** for both calculators
- 🆕 **Real-time price updates** 
- 🆕 **Loading states** during API calls
- 🆕 **Error handling** with user guidance

## Files to Modify

### Primary File
- **`src/App.js`**: Add ticker fields and API integration to existing dual calculator

### Key Sections to Enhance
1. **Stock Calculator Form** (~line 100-200): Add ticker input + price lookup
2. **ETF Calculator Form** (~line 300-400): Add ticker input + price lookup  
3. **State Management**: Add ticker fields to both input states
4. **API Function**: Create shared `fetchPrice` function for both calculators

## Recommended APIs

### Option 1: Financial Modeling Prep
- **Free tier**: 250 calls/day
- **Endpoint**: `https://financialmodelingprep.com/api/v3/quote/{symbol}?apikey=demo`
- **Supports**: Both Canadian (.TO) and US markets

### Option 2: Alpha Vantage  
- **Free tier**: 500 calls/day
- **Good documentation and reliability

## Success Criteria

### Functional Requirements
- [ ] Stock calculator has working price lookup
- [ ] ETF calculator has working price lookup  
- [ ] Tab switching still works perfectly
- [ ] All existing calculations unchanged
- [ ] Canadian tickers work (XEQT.TO, SHOP.TO)
- [ ] US tickers work (AAPL, VTI, MSFT)

### Integration Requirements  
- [ ] No disruption to existing functionality
- [ ] Maintains current responsive design
- [ ] Loading states work on both calculators
- [ ] Error handling works appropriately
- [ ] Deployment to Netlify still works

## Current Live Version
- **URL**: https://analyze-stocks-and-etfs.netlify.app
- **Status**: Clean dual calculator without API integration
- **Framework**: React 19, Node 24.3
- **Platform**: Netlify with auto-deployment from GitHub

## Context
This calculator has been validated with real market analysis and is actively used for investment decisions. The price lookup feature is the final enhancement needed to eliminate manual price entry while preserving the complete dual-calculator functionality that users rely on.