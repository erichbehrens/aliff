const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	entry: {
		popup: './src/popup.js',
		options: './src/options.js',
		analytics: './src/analytics.js',
		contentscript: './src/contentscript.js',
		background: './src/background.js',
	},
	output: {
		path: path.join(__dirname, 'build'),
		filename: '[name].js',
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
			{
				test: /\.css$/,
				exclude: /node_modules/,
				loader: ExtractTextPlugin.extract('css-loader?modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]!postcss-loader'),
			},
			{
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'url-loader?limit=10000&mimetype=image/svg+xml',
			},
		],
	},

	plugins: [
		new CleanWebpackPlugin(['build']),
		new ExtractTextPlugin('[name].css'),
		new HtmlWebpackPlugin({
			inject: true,
			chunks: ['analytics', 'popup'],
			chunksSortMode: (chunk1, chunk2) => {
				const orders = ['analytics', 'popup'];
				const order1 = orders.indexOf(chunk1.names[0]);
				const order2 = orders.indexOf(chunk2.names[0]);
				if (order1 > order2) {
					return 1;
				} else if (order1 < order2) {
					return -1;
				}
				return 0;
			},
			filename: 'popup.html',
			template: './src/index.html',
		}),
		new HtmlWebpackPlugin({
			inject: true,
			chunks: ['analytics', 'options', 'contentscript'],
			chunksSortMode: (chunk1, chunk2) => {
				const orders = ['analytics', 'options'];
				const order1 = orders.indexOf(chunk1.names[0]);
				const order2 = orders.indexOf(chunk2.names[0]);
				if (order1 > order2) {
					return 1;
				} else if (order1 < order2) {
					return -1;
				}
				return 0;
			},
			filename: 'options.html',
			template: './src/index.html',
		}),
		new CopyWebpackPlugin([
			{ context: path.resolve(__dirname), from: 'src/manifest.json' },
			{ context: './src/assets', from: '**', to: 'assets' },
		]),

	],

	devtool: 'source-map',
};
