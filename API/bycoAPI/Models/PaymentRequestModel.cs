namespace bycoAPI.Models
{
    public class PaymentRequestModel
    {
        public string? Mode { get; set; }
        public string? ApiVersion { get; set; }
        public string? Secure3DSecurityLevel { get; set; }
        public string? TerminalProvUserId { get; set; }
        public string? TerminalUserId { get; set; }
        public string? TerminalMerchantId { get; set; }
        public string? TerminalId { get; set; }
        public string? OrderId { get; set; }
        public string? SuccessUrl { get; set; }
        public string? ErrorUrl { get; set; }
        public string? CustomerEmailAddress { get; set; }
        public string? CustomerIpAddress { get; set; }
        public string? CompanyName { get; set; }
        public string? Lang { get; set; }
        public string? TxnTimestamp { get; set; }
        public string? Secure3DHash { get; set; }
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
