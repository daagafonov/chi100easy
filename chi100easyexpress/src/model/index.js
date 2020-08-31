module.exports = {
    User: require('./User'),
    Order: require('./Order'),
    OrderItem: require('./OrderItem'),
    actions: {
        user: require('./UserActions'),
        order: require('./OrderActions'),
        orderItem: require('./OrderItemsActions'),
        products: require('./dictionary/ProductActions'),
    }
}
