namespace bycoAPI.Models
{
    public class PaymentResultModel
    {
        public string? MdStatus { get; set; }
        public string? MdErrorMessage { get; set; }
        public string? ErrMsg { get; set; }
        public string? ClientId { get; set; }
        public string? Oid { get; set; }
        public string? Response { get; set; }
        public string? ProcReturnCode { get; set; }
        public string? SuccessUrl { get; set; }
        public string? ErrorUrl { get; set; }
        public string? TxnAmount { get; set; }
        public string? TxnCurrencyCode { get; set; }
    }
}
