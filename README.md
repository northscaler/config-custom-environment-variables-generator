# Node.js Custom Environment Variables Generator for `config`-Based Projects

This is a handy little utility that will generate JSON suitable for use as a [`config`](https://www.npmjs.com/package/config) -based project's `config/custom-environment-variables.json`.  (Note that throughout this project "cev" stands for "custom environment variables".)

> NOTE: This package supercedes [https://www.npmjs.com/package/config-cev-generator](https://www.npmjs.com/package/config-cev-generator)

See [this blog post](http://www.scispike.com/blog/get-rid-of-node-js-config-grunt-work) for full description and tips.

It really comes in handy when your configuration starts to get big and you forget to keep
your `config/custom-environment-variables.json` file in sync with the rest of your configuration.

> NOTE: If you're using TypeScript, make sure `ts-node` is on your `PATH` and that you use `cev-ts` instead of `cev`.

## Example
```
# cd into a config-based Node.js project...
$ npm install --save-dev @northscaler/config-custom-environment-variables-generator
$ npx cev
```
If your project's configuration is
```
{
  "foo": {
    "bar": "snafu",
    "goo": "juju"
  }
}
```
then the preceding command will generate JSON to stdout suitable for use as your project's `config/custom-environment-variables.json`:
```
{
  "foo": {
    "bar": "NODE_APP_FOO_BAR",
    "goo": "NODE_APP_FOO_GOO"
  }
}
```

In order to support `config`'s `__format` feature, see the following example.
If your project's configuration is
```
{
  "foo": {
    "bar": 1,
    "goo": 2
  },
  "snafu": "something"
}
```
then the following command will cause your configuration's `foo.bar` value to use format `json` and `foo.goo` to use `number`:
```
npx cev -k foo.bar=json -k foo.goo=number
```

The CLI writes to stdout by default.
To save the output, just direct it to a file:

`$ npx cev > config/custom-environment-variables.json`

... or give the file as the sole positional argument:

`$ npx cev config/custom-environment-variables.json`

## Prerequisites

The generator requires that your project have a valid `config`-based configuration in order to work properly.

## Tips
 - The default environment variable prefix is `NODE_APP`.  Customize with `-p` or `--prefix`.
 - The default word separator is `_`.  Customize with `-s` or `--separator`.
 - Run `cev --help` for more information.
