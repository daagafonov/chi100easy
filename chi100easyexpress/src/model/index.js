module.exports = {
    User: require('./User'),
    Order: require('./Order'),
    OrderItem: require('./OrderItem'),
    Document: require('./Document'),
    Product: require('./dictionary/Product'),
    Payment: require('./Payment'),
    LoginUser: require('./LoginUser'),
    LoginRole: require('./LoginRole'),
    Offer: require('./Offer'),
    UserAddress: require('./UserAddress'),
    actions: {
        user: require('./UserActions'),
        order: require('./OrderActions'),
        offer: require('./OfferActions'),
        orderItem: require('./OrderItemsActions'),
        product: require('./dictionary/ProductActions'),
        document: require('./DocumentActions'),
        payment: require('./PaymentActions'),
        loginUser: require('./LoginUserActions'),
        userAddress: require('./UserAddressActions'),
    }
}
