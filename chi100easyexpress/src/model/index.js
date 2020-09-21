module.exports = {
    User: require('./User'),
    Order: require('./Order'),
    OrderItem: require('./OrderItem'),
    Document: require('./Document'),
    Product: require('./dictionary/Product'),
    actions: {
        user: require('./UserActions'),
        order: require('./OrderActions'),
        orderItem: require('./OrderItemsActions'),
        product: require('./dictionary/ProductActions'),
        document: require('./DocumentActions'),
    }
}
