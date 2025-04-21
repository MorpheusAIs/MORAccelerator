
FOR OUR PROJECT:

Based on your Next.js, TypeScript, Hardhat, and ethers.js tech stack, I've rewritten the API integration using React Hooks, React Query (@tanstack/react-query), and axios for efficient data fetching.

Steps for Implementation
Install dependencies (if not already installed):

npm install axios @tanstack/react-query

Create a hook to fetch Morpheus API data (useMorpheusData.ts).
Use the hook in your Next.js components to display the data.

1. Custom Hook for Fetching MOR Token Data

Create a new file:
📄 hooks/useMorpheusData.ts

typescript

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// API Base URL
const BASE_URL = "https://morpheus-ai-metrics-a9febnfedac6a6fx.centralus-01.azurewebsites.net";

// Function to fetch token price
const fetchTokenPrice = async () => {
  const { data } = await axios.get(`${BASE_URL}/prices_and_trading_volume`);
  return data;
};

// Function to fetch staking metrics
const fetchStakingMetrics = async () => {
  const { data } = await axios.get(`${BASE_URL}/analyze-mor-stakers`);
  return data;
};

// Function to fetch GitHub commits (code contributions)
const fetchCodeContributions = async () => {
  const { data } = await axios.get(`${BASE_URL}/github_commits`);
  return data;
};

// Custom React Query Hook
export const useMorpheusData = () => {
  const { data: tokenPrice, error: priceError, isLoading: priceLoading } = useQuery({
    queryKey: ["morpheusTokenPrice"],
    queryFn: fetchTokenPrice,
  });

  const { data: stakingMetrics, error: stakingError, isLoading: stakingLoading } = useQuery({
    queryKey: ["morpheusStaking"],
    queryFn: fetchStakingMetrics,
  });

  const { data: codeContributions, error: codeError, isLoading: codeLoading } = useQuery({
    queryKey: ["morpheusCodeContributions"],
    queryFn: fetchCodeContributions,
  });

  return {
    tokenPrice,
    stakingMetrics,
    codeContributions,
    loading: priceLoading || stakingLoading || codeLoading,
    error: priceError || stakingError || codeError,
  };
};


2. Next.js Component to Display MOR Token Data

Create a new component:

📄 components/MorpheusDashboard.tsx

tsx
"use client"; // Ensure this runs only on the client side

import React from "react";
import { useMorpheusData } from "../hooks/useMorpheusData";
import { Card, CardContent } from "@/components/ui/card";

const MorpheusDashboard = () => {
  const { tokenPrice, stakingMetrics, codeContributions, loading, error } = useMorpheusData();

  if (loading) return <p>Loading Morpheus Data...</p>;
  if (error) return <p>Error fetching Morpheus data.</p>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Token Price Card */}
      <Card className="shadow-lg">
        <CardContent className="p-4">
          <h2 className="text-lg font-bold">MOR Token Price</h2>
          <p className="text-2xl">${tokenPrice?.price || "N/A"}</p>
          <p className="text-gray-500">Trading Volume: ${tokenPrice?.trading_volume || "N/A"}</p>
        </CardContent>
      </Card>

      {/* Staking Metrics Card */}
      <Card className="shadow-lg">
        <CardContent className="p-4">
          <h2 className="text-lg font-bold">Staking Metrics</h2>
          <p>Total Stakers: {stakingMetrics?.staker_analysis?.total_unique_stakers?.combined || "N/A"}</p>
          <p>Average Stake Time: {stakingMetrics?.staker_analysis?.combined_average_stake_time || "N/A"}</p>
        </CardContent>
      </Card>

      {/* Code Contributions Card */}
      <Card className="shadow-lg">
        <CardContent className="p-4">
          <h2 className="text-lg font-bold">Code Contributions</h2>
          {codeContributions ? (
            <ul>
              {Object.entries(codeContributions).map(([repo, commits]) => (
                <li key={repo}>
                  <strong>{repo}</strong>: {Object.keys(commits).length} commits
                </li>
              ))}
            </ul>
          ) : (
            <p>No data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MorpheusDashboard;
3. Integrate the Dashboard in Next.js
In your pages or app directory, import and use the MorpheusDashboard component.

📄 pages/index.tsx (for App Router)

tsx
import dynamic from "next/dynamic";

const MorpheusDashboard = dynamic(() => import("@/components/MorpheusDashboard"), { ssr: false });

export default function Home() {
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Morpheus AI Dashboard</h1>
      <MorpheusDashboard />
    </main>
  );
}
4. (Optional) Adding Graphs with Recharts
If you want to visualize staking data over time, modify MorpheusDashboard.tsx to include a line chart using recharts:

Install Recharts (if not already installed)
bash

npm install recharts
Modify MorpheusDashboard.tsx
tsx

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Prepare staking history data
const stakingHistory = Object.entries(stakingMetrics?.staker_analysis?.daily_unique_stakers || {}).map(([date, stakers]) => ({
  date,
  uniqueStakers: stakers.combined,
}));

{/* Staking Chart */}
<Card className="col-span-2 shadow-lg">
  <CardContent className="p-4">
    <h2 className="text-lg font-bold">Daily Stakers Over Time</h2>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={stakingHistory}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="uniqueStakers" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  </CardContent>
</Card>

Final Features of this Implementation
✅ Fully compatible with your tech stack (Next.js 14, TypeScript, Chakra UI, Tailwind, React Query, ethers.js).
✅ Efficient Data Fetching using React Query (caching, auto-refetch).
✅ Recharts Integration for real-time visualization of staking data.
✅ Client-side fetching with Next.js (prevents SSR errors).




IF WRITING IN PYTHON:

API Endpoints of Interest
Token Price & Trading Volume

Endpoint: /prices_and_trading_volume
URL: https://morpheus-ai-metrics-a9febnfedac6a6fx.centralus-01.azurewebsites.net/prices_and_trading_volume
Staking Metrics

Endpoint: /analyze-mor-stakers
URL: https://morpheus-ai-metrics-a9febnfedac6a6fx.centralus-01.azurewebsites.net/analyze-mor-stakers
Code Contribution Metrics

Endpoint: /github_commits
URL: https://morpheus-ai-metrics-a9febnfedac6a6fx.centralus-01.azurewebsites.net/github_commits
2. Set Up API Calls
You can use Python’s requests library to fetch this data.

(a) Fetch MOR Token Price & Trading Volume
python
Copy
Edit
import requests

def get_token_price():
    url = "https://morpheus-ai-metrics-a9febnfedac6a6fx.centralus-01.azurewebsites.net/prices_and_trading_volume"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        print("MOR Token Price:", data.get("price"))
        print("Trading Volume:", data.get("trading_volume"))
    else:
        print("Error fetching data:", response.status_code)

get_token_price()
(b) Fetch Staking Metrics
python
Copy
Edit
def get_staking_metrics():
    url = "https://morpheus-ai-metrics-a9febnfedac6a6fx.centralus-01.azurewebsites.net/analyze-mor-stakers"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        print("Total Unique Stakers:", data["staker_analysis"]["total_unique_stakers"]["combined"])
        print("Daily Unique Stakers:", data["staker_analysis"]["daily_unique_stakers"])
        print("Average Stake Time:", data["staker_analysis"]["combined_average_stake_time"])
    else:
        print("Error fetching staking data:", response.status_code)

get_staking_metrics()
(c) Fetch Code Contribution (GitHub Commits)
python
Copy
Edit
def get_code_contributors():
    url = "https://morpheus-ai-metrics-a9febnfedac6a6fx.centralus-01.azurewebsites.net/github_commits"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        print("Code Contributions Across Repositories:")
        for repo, commits in data.items():
            print(f"{repo}: {len(commits)} commits")
    else:
        print("Error fetching code contributions:", response.status_code)

get_code_contributors()
3. Automating API Fetching & Storing Data
If you want to fetch data regularly and store it in a CSV file:

python

import csv
from datetime import datetime

def save_data_to_csv(data, filename="morpheus_data.csv"):
    fieldnames = ["timestamp", "price", "trading_volume", "total_stakers", "daily_stakers", "average_stake_time"]

    # Check if the file exists
    try:
        with open(filename, 'r') as f:
            exists = True
    except FileNotFoundError:
        exists = False

    with open(filename, 'a', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        
        # Write header if file does not exist
        if not exists:
            writer.writeheader()
        
        # Write data
        writer.writerow({
            "timestamp": datetime.now().isoformat(),
            "price": data["price"],
            "trading_volume": data["trading_volume"],
            "total_stakers": data["staker_analysis"]["total_unique_stakers"]["combined"],
            "daily_stakers": len(data["staker_analysis"]["daily_unique_stakers"]),
            "average_stake_time": data["staker_analysis"]["combined_average_stake_time"]
        })

def fetch_and_save_morpheus_data():
    url_price = "https://morpheus-ai-metrics-a9febnfedac6a6fx.centralus-01.azurewebsites.net/prices_and_trading_volume"
    url_staking = "https://morpheus-ai-metrics-a9febnfedac6a6fx.centralus-01.azurewebsites.net/analyze-mor-stakers"

    price_response = requests.get(url_price)
    staking_response = requests.get(url_staking)

    if price_response.status_code == 200 and staking_response.status_code == 200:
        price_data = price_response.json()
        staking_data = staking_response.json()
        
        combined_data = {**price_data, **staking_data}
        save_data_to_csv(combined_data)
    else:
        print("Error fetching data.")

fetch_and_save_morpheus_data()
4. Advanced Use Cases
If you want to display this data on a dashboard (e.g., using Flask for a web app):

Set up Flask

bash
Copy
Edit
pip install flask
Create a Flask App

python
Copy
Edit
from flask import Flask, jsonify
import requests

app = Flask(__name__)

@app.route('/morpheus-data', methods=['GET'])
def get_morpheus_data():
    url_price = "https://morpheus-ai-metrics-a9febnfedac6a6fx.centralus-01.azurewebsites.net/prices_and_trading_volume"
    url_staking = "https://morpheus-ai-metrics-a9febnfedac6a6fx.centralus-01.azurewebsites.net/analyze-mor-stakers"

    price_response = requests.get(url_price)
    staking_response = requests.get(url_staking)

    if price_response.status_code == 200 and staking_response.status_code == 200:
        price_data = price_response.json()
        staking_data = staking_response.json()
        return jsonify({**price_data, **staking_data})
    else:
        return jsonify({"error": "Failed to fetch data"}), 500

if __name__ == '__main__':
    app.run(debug=True)
Run the Flask Server

bash

python app.py
Access API in Browser Open http://127.0.0.1:5000/morpheus-data to see the live data.