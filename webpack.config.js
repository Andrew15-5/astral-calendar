const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackRemoveEmptyScripts = require('webpack-remove-empty-scripts');
const FilemanagerWebpackPlugin = require('filemanager-webpack-plugin');

const is_production = process.env.NODE_ENV === 'production';
const is_development = !is_production;

const pages_dir_name = 'pages';
const pages_dir = path.resolve('src', 'server', pages_dir_name);

const public_dir_name = 'public';
const public_dir = path.resolve(public_dir_name);
const output_dir = path.resolve(is_production ? 'build' : public_dir_name);
const js_dir = path.join(public_dir, 'js');
const styles_dir = path.join(public_dir, 'styles');

const config = {
  entry: {
    selectors: './src/client/selectors.ts',
    month: './src/client/month.ts',
    main: './src/styles/main.sass',
    ...(is_development
      ? { live: path.join(public_dir, '.dev', 'live.js') }
      : {}),
  },
  output: {
    path: output_dir,
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new WebpackRemoveEmptyScripts(),
    new FilemanagerWebpackPlugin({
      runOnceInWatchMode: true,
      events: {
        onStart: {
          delete: [
            js_dir,
            styles_dir,
            path.join(public_dir, '*.js*'),
            path.join(public_dir, '*.css*'),
            ...(is_production ? [output_dir] : []),
          ],
        },
        onEnd: [
          {
            copy: [
              {
                source: path.join(output_dir, '*.js*'),
                destination: js_dir,
              },
              {
                source: path.join(output_dir, '*.css*'),
                destination: styles_dir,
              },
            ],
          },
          {
            delete: [
              path.join(output_dir, '*.js*'),
              path.join(output_dir, '*.css*'),
            ],
          },
          ...(is_production
            ? [
                {
                  delete: [
                    path.join(public_dir, '*.js*'),
                    path.join(public_dir, '*.css*'),
                    path.join(js_dir, '**', '*.d.ts'),
                    path.join(js_dir, '*/'),
                  ],
                },
                {
                  mkdir: [path.join(output_dir, public_dir_name)],
                },
                {
                  copy: [
                    {
                      source: public_dir,
                      destination: path.join(output_dir, public_dir_name),
                    },
                    {
                      source: pages_dir,
                      destination: path.join(output_dir, pages_dir_name),
                    },
                  ],
                },
              ]
            : []),
        ],
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: '/node_modules/',
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
        exclude: '/node_modules/',
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: '/node_modules/',
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { url: false },
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
    symlinks: false,
  },
};

module.exports = () => {
  if (is_production) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }
  return config;
};
