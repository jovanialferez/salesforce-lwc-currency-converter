@isTest
public class CurrencyConverterControllerTest {
    @isTest
    static void testCanGetRates(){
        Test.startTest();
        StaticResourceCalloutMock mock = new StaticResourceCalloutMock();
        mock.setStaticResource('DummyRatesResource');
        mock.setStatusCode(200);
        mock.setHeader('Content-Type', 'application/json;charset=UTF-8');
        // Associate the callout with a mock response
        Test.setMock(HttpCalloutMock.class, mock);

        Map<String, Object> rates = CurrencyConverterController.getRates('EUR');
        System.assertEquals(8, rates.size());
        Test.stopTest();
    }
}
