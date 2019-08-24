public with sharing class CurrencyConverterController {
    // Retrieve latest rates from fixer.io
    // then return payload in currency: rate
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getRates(String baseCurrency) {
        Map<String, Object> rates = new Map<String, Object>();

        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('http://data.fixer.io/api/latest?access_key=' + Label.FIXER_ACCESS_KEY);
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        if (response.getStatusCode() == 200) {
            // Deserialize the JSON string into collections of primitive data types.
            Map<String, Object> results = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            // Cast the values in the 'rates' key as a map of currency to rate value
            // Expected: { 'USD': X.XXXX, 'GBP': Z.ZZZZ, ...}
            rates = (Map<String, Object>) results.get('rates');
        }
        
        return rates;
    }
}
