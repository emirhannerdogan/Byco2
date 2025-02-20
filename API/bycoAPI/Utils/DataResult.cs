namespace Utils;

public class DataResult<T> : Result {

    
    public T Data {get;}

    public DataResult(bool Success, T Data) : base(Success) {
        this.Data = Data;
    }

    public DataResult(bool Success, string Message, T Data) : base(Success, Message) {
        this.Data = Data;
    }
}
