import {PaymentStatus} from "@/model/PaymentStatusEnum";
import {CurrencyEnum} from "@/model/CurrencyEnum";

export default class Payment {
    merchantAccount: String = '';
    orderReference: String = '';
    amount: Number = 0.0;
    currency: CurrencyEnum = CurrencyEnum.UAH;
    email: String = '';
    phone: String = '';
    transactionStatus: PaymentStatus = PaymentStatus.EMPTY;
    fee: Number = 0.0;
}
