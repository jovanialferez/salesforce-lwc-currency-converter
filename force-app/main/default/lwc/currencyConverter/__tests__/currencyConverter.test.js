import { createElement } from 'lwc'
import CurrencyConverter from 'c/currencyConverter'
import getRates from '@salesforce/apex/CurrencyConverterController.getRates'

jest.mock(
    '@salesforce/apex/CurrencyConverterController.getRates',
    () => {
        return {
            default: jest.fn()
        }
    },
    { virtual: true }
)


// Dummy data (8 sample rates)
const FIXER_RATES =  {
    "CAD": 1.49864,
    "CHF": 1.095392,
    "CNY": 7.976302,
    "GBP": 0.915499,
    "HKD": 8.816203,
    "PHP": 58.810844,
    "SGD": 1.559174,
    "USD": 1.12405
}


describe('c-currency-converter', () => {
    afterEach(() => {
         // The jsdom instance is shared across test cases in a single file so reset the DOM
         while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild)
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks()
    })

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling imperative Apex.
    function flushPromises() {
        // eslint-disable-next-line no-undef
        return new Promise(resolve => setImmediate(resolve));
    }

    it('it renders amount, base currency select box, target currency select box', () => {
        // Load our mock data
        getRates.mockResolvedValue(FIXER_RATES)

        const element = createElement('c-currency-converter', {
            is: CurrencyConverter
        })
        document.body.appendChild(element)
        expect(element.shadowRoot.querySelector('input[name="amount"]')).not.toBeNull()
        expect(element.shadowRoot.querySelector('select[name="baseCurrency"]')).not.toBeNull()
        expect(element.shadowRoot.querySelector('select[name="targetCurrency"]')).not.toBeNull()
    })

    it('it populates the target currency from apex call to getRates', () => {
        // Load our mock data
        getRates.mockResolvedValue(FIXER_RATES)

        const element = createElement('c-currency-converter', {
            is: CurrencyConverter
        })
        document.body.appendChild(element)
        
        return flushPromises().then(() => {
            const options = element.shadowRoot.querySelectorAll('select[name="targetCurrency"] option')
            expect(options).toHaveLength(8)
            options.forEach(option => {
                expect(FIXER_RATES[option.value]).toBeDefined()
            })

        })
    })

    it('it does the conversion', () => {
        // Load our mock data
        getRates.mockResolvedValue(FIXER_RATES)

        const element = createElement('c-currency-converter', {
            is: CurrencyConverter
        })
        document.body.appendChild(element)
        
        return flushPromises().then(() => {
            // Set amount to 10
            // Select USD as target
            // So we should expect 10 * FIXED_RATE['USD']
            const amountEl = element.shadowRoot.querySelector('input[name="amount"]')
            expect(amountEl.value).toBe('1') // initial value
            amountEl.value = 10
            amountEl.dispatchEvent(new CustomEvent('change')) // to trigger our handlers

            const targetCurrencyEl = element.shadowRoot.querySelector('select[name="targetCurrency"]')
            targetCurrencyEl.value = 'USD'
            targetCurrencyEl.dispatchEvent(new CustomEvent('change')) // to trigger our handlers
            expect(element.shadowRoot.querySelector('select[name="targetCurrency"] option:checked').value).toBe('USD')
            
            const buttonEl = element.shadowRoot.querySelector('button[type="submit"]')
            buttonEl.click()

            // Return a promise to wait for any asynchronous DOM updates.
            return flushPromises().then(() => {
                // That container should now appear
                expect(element.shadowRoot.querySelector('div.conversion-result')).not.toBeNull()
                // eslint-disable-next-line dot-notation
                expect(parseFloat(element.shadowRoot.querySelector('div.conversion-result strong').textContent)).toBe(10 * FIXER_RATES['USD'])
            })            
        })
    })
})