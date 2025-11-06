import './assets/main.css'
import axios from 'axios'

const BASE_URL = `http://${location.hostname}:7146`
const CREATE_ORDER_URL = `${BASE_URL}/createOrder`
const CREATE_REFUND_URL = `${BASE_URL}/createRefund`

const appDiv = document.querySelector<HTMLDivElement>('#app')

const getLink = async (queryUrl: string) => {
  const params = { productId: 'xxx' }
  try {
    const res = await axios.post(queryUrl, params)
    const { url, token } = res.data
    // locale: en / zh
    // Payment Link: https://checkout.cobo.com/payment?token=xxx&locale=en
    // Refund Link: https://checkout.cobo.com/refund?token=xxx&locale=en
    return `${url}?token=${token}&locale=en`
  } catch (e) {
    alert(JSON.stringify(e?.response?.data))
    return null
  }
}

const queryLinkAndJump = async(queryUrl: string) => {
  const url = await getLink(queryUrl)
  if (!url) return
  window.open(url, '_blank')
}

document.addEventListener('DOMContentLoaded', () => {
  /* Payment：include url mode and iframe mode */
  // url mode
  document.getElementById('urlModeBtn')?.addEventListener('click', async () => {
    queryLinkAndJump(CREATE_ORDER_URL)
  })

  // iframe mode
  document.getElementById('iframeModeBtn')?.addEventListener('click', async () => {
    const url = await getLink(CREATE_ORDER_URL)
    if (!url) return

    appDiv!.innerHTML = `
    <div class="page">
      <div class="grid">
        <div class="left">
          <div class="card product">
            <div class="thumb"></div>
            <div class="title">Product Order Information</div>
          </div>
        </div>
        <div class="right">
          <div class="card no-padding">
            <div id="iframeContainer" class="iframe-container iframe-fit">
              <iframe
                id="checkoutIframe"
                src="${url}"
                width="100%"
                height="100%"
                frameborder="0"
                allow="clipboard-write"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
  })

  /* Refund */
  document.getElementById('refundBtn')?.addEventListener('click', async () => {
    queryLinkAndJump(CREATE_REFUND_URL)
  })
})

appDiv!.innerHTML = `
  <div class="page">
    <div class="grid">
      <div class="left">
        <div class="card product">
          <div class="thumb"></div>
          <div class="title">Product Order Information</div>
        </div>

        <div class="card">
          <div class="section-title">Payment Option</div>
          <label class="method active" id="m-crypto">
            <input type="radio" name="method" value="crypto" checked />
            <div>Pay with Crypto (USDT/USDC)</div>
          </label>
        </div>
      </div>

      <div class="right">
        <div class="card">
          <div class="summary-row">
            <span>Price</span>
            <span>xxx</span>
          </div>
          <div class="summary-row">
            <span>Payment Fee</span>
            <span>xxx</span>
          </div>
          <div class="divider"></div>
          <div class="actions">
            <button id="urlModeBtn" class="pay-btn">Pay Now (By New Window)</button>
            <button id="iframeModeBtn" class="pay-btn">Pay Now (By Iframe)</button>
            <button id="refundBtn" class="refund-btn">Refund</button>
          </div>
        </div>
      </div>
    </div>
  </div>
`
