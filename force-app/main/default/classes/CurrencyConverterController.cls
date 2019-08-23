public with sharing class CurrencyConverterController {
    @AuraEnabled
    public static Map<String, Decimal> getRates(String baseCurrency) {
        Map<String, Decimal> rates = new Map<String, Decimal>();
        rates.put('USD', 1.11451);
        rates.put('PHP', 58.327916);
        return rates;
    }
}
