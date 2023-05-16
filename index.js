const fs = require('fs');
const crypto = require("crypto");
const moment = require("moment");

const config = {
    upc: {
        pemPath: '/upc.pem',
        MerchantId: '00000',
        TerminalId: '00000',
    }
};

function createSignatureUpc(data) {
    const privateKey = fs.readFileSync(config.upc.pemPath,  "utf-8");
    const sign = crypto.createSign('SHA256')
                        .update(data)
                        .end()
                        .sign(privateKey);
    const signature = Buffer.from(sign).toString('base64');
    return signature
}

function createUpcData(price, id) {
    const CURRENCY_CODE_UAH = 980;
    const fields = `{MerchantId};{TerminalId};{PurchaseTime};{OrderID};{CurrencyId};{TotalAmount};;`
    const CENTS_IN_UAH = 100;
    const totalAmountCents = price * CENTS_IN_UAH;
    const data = {
        MerchantID: config.upc.MerchantId,
        TerminalID: config.upc.TerminalId,
        PurchaseTime: moment().format('YYMMDDHHmmss'),
        OrderID: id,
        Currency: CURRENCY_CODE_UAH,
        TotalAmount: totalAmountCents,
    }
    const fieldsForSignature = fields
                    .replace('{MerchantId}', data.MerchantID)
                    .replace('{TerminalId}', data.TerminalID)
                    .replace('{PurchaseTime}', data.PurchaseTime)
                    .replace('{OrderID}', data.OrderID)
                    .replace('{CurrencyId}', data.Currency)
                    .replace('{TotalAmount}', data.TotalAmount);

    const signature = cryptoUtils.createSignatureUpc(fieldsForSignature)

    return { signature, data }
}