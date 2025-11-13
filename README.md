# Cobo Payment Link Demo

## Project Overview

This is a pure JavaScript demo that demonstrates how to generate Payment Link, Refund Link and Subscription Link (coming soon)

1. Frontend selects payment, refund or subscription and requests backend to generate link
2. Backend calls Cobo Waas API and returns the generated Link (including token) to frontend
3. After frontend receives the Link, it supports both URL and iframe modes for opening

## Prerequisites

Before running this demo, please ensure:

1. Create API Key and API Secret, and activate them in Cobo Portal
2. Fill in the API Key and API Secret in server.js

## Installation and Running

```bash
# Install dependencies
pnpm install

# Start (Start browser side and server side at the same time)
npm run start

# Or
# Start browser side only
npm run dev

# Start server side only
npm run server
```
