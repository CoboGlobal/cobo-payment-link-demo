import axios from 'axios';
import crypto from 'crypto';
import express from 'express';
import nacl from 'tweetnacl';
import qs from 'querystring';

// Test environment
const BASE_URL = 'https://api.dev.cobo.com';
// Production environment
// const BASE_URL = 'https://api.cobo.com';

const API_KEY = '';
const API_SECRET = '';

const app = express();

app.listen(7146, () => {
  console.log('Express server running at http://localhost:7146/');
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

app.post('/createOrder', async (req, res) => {
  const path = '/v2/payments/links/orders';
  // For detailed parameter explanation, please refer to API documentation: https://www.cobo.com/developers/v2/api-references/payment/create-pay-in-order
  const body = {
    business_info: {
      merchant_id: 'M1002',
      merchant_order_code: `order-${Date.now()}`,
      psp_order_code: `psp-${Date.now()}`,
      currency: 'USD',
      order_amount: '1',
      fee_amount: '0',
      // Order amount deviation range (optional, default: 0)
      // As long as the difference between the user's actual payment amount and the receivable amount is within this range, the payment is considered successful (unit: USDT)
      amount_tolerance: '0',
      // Custom exchange rates (optional)
      custom_exchange_rates: [
        {
          token_id: 'ETH_USDT',
          exchange_rate: '0.99',
        },
      ],
      // Supported payment tokens and chains, only partial list shown, more are actually supported
      // TTRON_USDT and SOLDEV_SOL_USDC are test environment specific and are not supported in production environment
      token_ids: [
        'ETH_USDT',
        'BSC_USDT',
        'TRON_USDT',
        'TTRON_USDT',
        'SOL_USDT',
        'SOL_USDC',
        'SOLDEV_SOL_USDC',
      ],
      // maximum 3 hours (unit: seconds)
      expired_in: 180 * 60,
    },
    display_info: {
      // Powered by xxx, only supports letters and @, length cannot exceed 20 characters, will be hidden if not passed or invalid
      developer_name: 'Cobo',
      logo: 'https://www.cobo.com/blue-logo.svg',
      // Return URL, optional
      return_url: "https://www.cobo.com",
    },
  };

  post(path, body, req, res);
});

app.post('/createRefund', async (req, res) => {
  const path = '/v2/payments/links/refunds';
  const body = {
    business_info: {
      transaction_id: '925e98ee-1f79-4504-bc8f-10157ac4669a', // Transaction ID, to associate the from address and tokenID of the original order transaction
      amount: '0.1', // Refund amount, usually the original paid amount
      refund_source: 'Merchant', // Psp or Merchant
      merchant_id: 'M1001', // If refund_source is Merchant, merchant_id is required
      fee_amount: '0.01', // Fee amount(optional). If the source is PSP, the fee is invalid
    },
    display_info: {
      // Powered by xxx, only supports letters and @, length cannot exceed 20 characters, will be hidden if not passed or invalid
      developer_name: 'Cobo',
      logo: 'https://www.cobo.com/blue-logo.svg',
    },
  };
  post(path, body, req, res);
});

const post = async (path, body, req, res) => {
  if (!API_KEY || !API_SECRET) {
    return res.status(500).send('API Key or API Secret is not set in server.js');
  }
  const method = 'POST';
  const headers = getHeaders(method, path, {}, body);

  try {
    // Demo is only for quick experience, please use Cobo Waas SDK in real scenarios
    const response = await axios.post(BASE_URL + path, body, { headers });
    res.send(response.data);
  } catch (e) {
    res.status(500).send(e.response.data);
  }
};

const getHeaders = (method, path, params, body) => {
  const paramStr = qs.stringify(params);
  const bodyStr = body ? JSON.stringify(body) : '';
  const timestamp = Date.now().toString();

  const strToSign = [method.toUpperCase(), path, timestamp, paramStr, bodyStr].join('|');

  const hash = crypto.createHash('sha256').update(strToSign).digest();
  const doubleHash = crypto.createHash('sha256').update(hash).digest();
  const secretBytes = Buffer.from(API_SECRET, 'hex');
  const keyPair = nacl.sign.keyPair.fromSeed(secretBytes);
  const signature = nacl.sign.detached(doubleHash, keyPair.secretKey);

  return {
    'Biz-Api-Key': API_KEY,
    'Biz-Api-Nonce': timestamp,
    'Biz-Api-Signature': Buffer.from(signature).toString('hex'),
  };
};
