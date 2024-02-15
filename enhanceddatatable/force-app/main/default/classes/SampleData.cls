public class SampleData {
    
    @AuraEnabled
    public static List<Account> getAccounts()
    {
        return [Select id, name, AccountNumber, Active__c, BillingAddress, YearStarted from Account Limit 20];
    }
}