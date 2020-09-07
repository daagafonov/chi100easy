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
    },
}
