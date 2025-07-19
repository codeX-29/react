import React, { useState, useEffect } from "react";
import "./InvestmentCalculator.css";

const currencySymbols = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
};

function InvestmentCalculator() {
  const [stock, setStock] = useState("");
  const [initial, setInitial] = useState("");
  const [growth, setGrowth] = useState("");
  const [years, setYears] = useState("");
  const [currency, setCurrency] = useState("INR"); // base
  const [targetCurrency, setTargetCurrency] = useState("USD"); // conversion
  const [result, setResult] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);

  // Fetch exchange rate on currency/targetCurrency change
  useEffect(() => {
    if (currency === targetCurrency) {
      setExchangeRate(1);
      return;
    }

    const fetchRate = async () => {
      try {
        const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`);
        const data = await res.json();
        const rate = data.rates[targetCurrency];
        setExchangeRate(rate);
      } catch (err) {
        console.error("Failed to fetch exchange rate", err);
        setExchangeRate(null);
      }
    };

    fetchRate();
  }, [currency, targetCurrency]);

  const calculateInvestment = (e) => {
    e.preventDefault();
    const P = parseFloat(initial);
    const r = parseFloat(growth) / 100;
    const t = parseFloat(years);
    if (!P || !r || !t) {
      setResult("Please fill all fields correctly.");
      return;
    }
    const A = P * Math.pow(1 + r, t);
    const converted = exchangeRate ? A * exchangeRate : null;

    setResult({
      base: `${currencySymbols[currency]} ${A.toFixed(2)}`,
      converted: converted ? `${currencySymbols[targetCurrency]} ${converted.toFixed(2)}` : "Conversion unavailable",
    });
  };

  const resetForm = () => {
    setStock("");
    setInitial("");
    setGrowth("");
    setYears("");
    setCurrency("INR");
    setTargetCurrency("USD");
    setResult(null);
  };

  return (
    <div className="calculator">
      <h2>Investment Calculator</h2>
      <img src="OIP.webp" alt="stock" className="image" />
      <form className="form" onSubmit={calculateInvestment}>
        <label>Stock/Asset Name</label>
        <input
          type="text"
          placeholder="Stock/Asset Name"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        <label>Initial Investment</label>
        <input
          type="number"
          placeholder="Initial Investment"
          value={initial}
          onChange={(e) => setInitial(e.target.value)}
        />
        <label>Annual Growth (%)</label>
        <input
          type="number"
          placeholder="Annual Growth (%)"
          value={growth}
          onChange={(e) => setGrowth(e.target.value)}
        />
        <label>Investment Period (Years)</label>
        <input
          type="number"
          placeholder="Investment Period (Years)"
          value={years}
          onChange={(e) => setYears(e.target.value)}
        />
        <label>Investment Currency</label>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          {Object.keys(currencySymbols).map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>
        <label>Target Currency</label>
        <select value={targetCurrency} onChange={(e) => setTargetCurrency(e.target.value)}>
          {Object.keys(currencySymbols).map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>
        <div className="buttons">
          <button type="submit">Calculate</button>
          <button type="button" onClick={resetForm}>Reset</button>
        </div>
        {result && (
          <div className="result">
            <h3>Projected Value:</h3>
            <p><strong>{currency}:</strong> {result.base}</p>
            <p><strong>{targetCurrency}:</strong> {result.converted}</p>
          </div>
        )}
      </form>
    </div>
  );
}

export default InvestmentCalculator;
