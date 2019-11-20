const QRCode = require('qrcode')

/**
 * Return links and qr for source
 * @param {Object} { source - ENUM['telegram', 'whatsapp', 'viber'],
 * token }
 */
const generateLinks = async ({ source, token }) => {
  const { LLX_TG_BOT, LLX_WHATSAPP_BOT, LLX_VIBER_BOT } = process.env
  const sources = {
    telegram: {
      webUrl: `https://t.me/${LLX_TG_BOT}?start=${token}`,
      appUrl: `tg://resolve?domain=${LLX_TG_BOT}&start=${token}`
    },
    whatsapp: {
      webUrl: `https://wa.me/${LLX_WHATSAPP_BOT}?text=token%20${token}`,
      appUrl: `whatsapp://send?phone=${LLX_WHATSAPP_BOT}&text=token%20${token}`
    },
    viber: {
      appUrl: `viber://pa?chatURI=${LLX_VIBER_BOT}&context=${token}`
    }
  }

  const qr = await QRCode.toDataURL(sources[source].appUrl)

  return {
    ...sources[source],
    qr
  }
}

module.exports = {
  generateLinks
}
