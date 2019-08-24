/*eslint no-console: "off"*/
import { LightningElement, track } from 'lwc'
import getRates from '@salesforce/apex/CurrencyConverterController.getRates'

export default class CurrencyConverter extends LightningElement {
    @track rates = []
    @track currencyOptions = []
    @track amount = 1
    @track baseCurrency = 'EUR'
    @track targetCurrency = 'GBP'
    @track convertedValue

    // Fetch our rates from apex, mark `selected` accordingly (select option consumption)
    fetchRates = () => {
        getRates({baseCurrency: this.baseCurrency})
            .then(data => {
                for (let currency in data) {
                    if (data.hasOwnProperty(currency)) {
                        this.rates = [...this.rates, { currency, value: data[currency], selected: currency === this.targetCurrency }]
                    }
                }
            })
            .catch(error => console.error(error))
    }

    connectedCallback() {
        this.fetchRates()
    }

    // Has no used for now, as our API key is only capable of using 'EUR' as base currency
    handleOnBaseCurrencyChange = (e) => {
        this.baseCurrency = e.target.value
        this.fetchRates()
    }

    // For amount and target currency input boxes
    handleOnInputChange = (e) => {
        this[e.target.name] = e.target.value
        this.convertedValue = null
    }

    // Find our rate for that currency then do the conversion
    handleOnFormSubmit = (e) => {
        e.preventDefault();
        
        const targetRate = this.rates.find(r => r.currency === this.targetCurrency)
        if (targetRate) {
            this.convertedValue = this.amount * targetRate.value
        }
    }
}