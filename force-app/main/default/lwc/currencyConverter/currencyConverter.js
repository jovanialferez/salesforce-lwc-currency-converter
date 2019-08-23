/*eslint no-console: "off"*/
import { LightningElement, wire, api } from 'lwc'
import getRates from '@salesforce/apex/CurrencyConverterController.getRates'

export default class CurrencyConverter extends LightningElement {
    @api rates

    @wire(getRates, { baseCurrency: 'EUR'})
    async wiredRates({ data }) {
        console.log(data)
        if (data && data.length) {
            this.rates = data
        }
   }
}