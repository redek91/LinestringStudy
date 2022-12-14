const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {
  CleanWebpackPlugin
} = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const plugins = [
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin(),
  new HtmlWebpackPlugin({
    template: "./src/index.html"
  }),
];

module.exports = (enc, arg) => {
  return {
    mode: arg.mode,
    entry: {
      index: './src/index.ts'
    },
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

              // npm package names are URL-safe, but some servers don't like @ symbols
              return `${packageName.replace('@', '')}`;
            },
          },
        }
      }
    },
    output: {
      // output path is required for `clean-webpack-plugin`
      path: path.resolve(__dirname, "dist"),
      filename: '[name].[contenthash].js',
      // this places all images processed in an image folder
      assetModuleFilename: "images/[hash][ext][query]"
    },
    module: {
      rules: [{
          test: /\.(s[ac]|c)ss$/i,
          use: [{
              loader: MiniCssExtractPlugin.loader,
              options: {
                // This is required for asset imports in CSS, such as url()
                publicPath: ""
              },
            },
            "css-loader",
            "postcss-loader",
            // according to the docs, sass-loader should be at the bottom, which
            // loads it first to avoid prefixes in your sourcemaps and other issues.
            "sass-loader"
          ]
        },
        {
          // Load model
          test: /\.(json|bin)$/,
          type: "asset",
          //include: path.resolve(__dirname, 'MLModel/ModelTrainer/decoderModel'),
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'model/',
            },
          }]
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          /**
           * The `type` setting replaces the need for "url-loader"
           * and "file-loader" in Webpack 5.
           *
           * setting `type` to "asset" will automatically pick between
           * outputing images to a file, or inlining them in the bundle as base64
           * with a default max inline size of 8kb
           */
          type: "asset",
          /**
           * If you want to inline larger images, you can set
           * a custom `maxSize` for inline like so:
           */
          // parser: {
          //   dataUrlCondition: {
          //     maxSize: 30 * 1024,
          //   },
          // },
        },
        {
          test: /\.(ts|js)x?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              /**
               * From the docs: When set, the given directory will be used
               * to cache the results of the loader. Future webpack builds
               * will attempt to read from the cache to avoid needing to run
               * the potentially expensive Babel recompilation process on each run.
               */
              cacheDirectory: false,
            }
          }
        },
      ]
    },
    plugins: plugins,
    // Temporary workaround for 'browserslist' bug that is being patched in the near future
    target: arg.env === "production" ? "browserslist" : "web",
    devtool: "source-map",
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    devServer: {
      static: "./dist",
      port: 4200,
      hot: true
    },
    performance: {
      maxAssetSize: 1000000,
      maxEntrypointSize: 2000000
    }
  }
}