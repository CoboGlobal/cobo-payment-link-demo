import './assets/main.css'
import axios from 'axios'

const appDiv = document.querySelector<HTMLDivElement>('#app')

const getPaymentLink = async () => {
  const params = { productId: 'xxx' }
  try {
    const res = await axios.post(`http://${location.hostname}:7146/createOrder`, params)
    const { url, token } = res.data
    // locale: en / zh
    // https://checkout.cobo.com/payment?token=xxx&locale=en
    return `${url}?token=${token}&locale=en`
  } catch (e) {
    alert(JSON.stringify(e?.response?.data))
    return null
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // url mode
  document.getElementById('urlModeBtn')?.addEventListener('click', async () => {
    const url = await getPaymentLink()
    if (!url) return
    window.open(url, '_blank')
  })

  // iframe mode
  document.getElementById('iframeModeBtn')?.addEventListener('click', async () => {
    const url = await getPaymentLink()
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
          </div>
        </div>
      </div>
    </div>
  </div>
`
