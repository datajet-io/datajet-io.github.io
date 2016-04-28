var webpack = require('webpack');
var path = require('path');

var isProduction = process.env.NODE_ENV === 'production';

var plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify(process.env['NODE_ENV'] || 'development'),
            'SERVER': JSON.stringify(process.env['SERVER'] || ''),
            'CLIENT_KEY': JSON.stringify(process.env['CLIENT_KEY'] || '')
        }
    })
];

if (isProduction) {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            mangle: {
                except: ['$super']
            }
        })
    )
}

module.exports = {
    entry: './app/Main',
    output: {
        filename: 'datajet.js'
    },
    resolve: {
        extensions: ['', '.js'],
        root: path.resolve('./app')
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015']
                },
                exclude: /(node_modules)/
            }

        ]
    },
    plugins: plugins
};
