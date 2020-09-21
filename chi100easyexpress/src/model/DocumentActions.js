const Document = require('./Document');

const createDocument = function(o) {
    return Document.create(o);
}

// const addOrderToUser = function(userId, order) {
//     const o = Order.updateOne({
//         _id: order._id
//     }, {
//         $set: {
//             user: userId,
//         }
//     });
//     return o;
// };
//
// const findByUserId = function(userId) {
//     return Order.find({
//         user: userId
//     });
// }
//
// const getOrderWithPopulate = function(id) {
//     return Order.findById(id).populate("items", "-__v");
// };
//
// const findById = function(id) {
//     return Order.findById(id);
// }
//
// const findAll = function() {
//     return Order.find();
// }
//
// const save = function() {
//     return Order.find();
// }
//
// const updateOne = function(id, fields) {
//     return Order.updateOne({
//         _id: id
//     }, {
//         $set: fields
//     });
// }

module.exports = {
    create:  createDocument,
    // addOrderToUser,
    // findById,
    // findAll,
    // getOrderWithPopulate,
    // findByUserId,
    // updateOne,
}
