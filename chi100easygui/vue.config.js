module.exports = {
    publicPath: '/chi100easy',
    pages: {
        index: {
            entry: 'src/main.ts',
            template: 'public/index.html',
            filename: 'index.html',
            title: 'Index',
            chunks: ['chunk-vendors', 'chunk-common', 'index'],
        },
        users: {
            entry: 'src/main.ts',
            template: 'public/index.html',
            filename: 'users.html',
            title: 'Users',
            chunks: ['chunk-vendors', 'chunk-common', 'users'],
        },
        about: {
            entry: 'src/main.ts',
            template: 'public/index.html',
            filename: 'about.html',
            title: 'About',
            chunks: ['chunk-vendors', 'chunk-common', 'about'],
        },
        products: {
            entry: 'src/main.ts',
            template: 'public/index.html',
            filename: 'products.html',
            title: 'Products',
            chunks: ['chunk-vendors', 'chunk-common', 'products'],
        },
        payments: {
            entry: 'src/main.ts',
            template: 'public/index.html',
            filename: 'payments.html',
            title: 'Payments',
            chunks: ['chunk-vendors', 'chunk-common', 'payments'],
        },
    },
}
