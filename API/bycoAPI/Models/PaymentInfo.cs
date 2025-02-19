namespace bycoAPI.Models
{
    public class PaymentInfo
    {
        public string? OrderId { get; set; }
        public string? SuccessUrl { get; set; }
        public string? ErrorUrl { get; set; }
        public string? CustomerEmailAddress { get; set; }
        public string? CustomerIpAddress { get; set; }
        public ulong TxnAmount { get; set; }
        public string? TxnType { get; set; }
        public int TxnCurrencyCode { get; set; }
        public int TxnInstallmentCount { get; set; }
        public string? CardHolderName { get; set; }
        public string? CardNumber { get; set; }
        public string? CardExpireDateMonth { get; set; }
        public string? CardExpireDateYear { get; set; }
        public string? CardCvv2 { get; set; }
    }
}
