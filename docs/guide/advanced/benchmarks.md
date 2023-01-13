# Benchmarks

For ObjectParser, I've written a simple benchmark engine for node.js and the browser.

**It works like this:** the script connects all available packages, test groups and tests, then runs all the loaded tests one by one and saves their results. After, finds the average value of each test.

The result is the number of iterations per millisecond. **The larger it is, the faster** the script runs.

:::warning Warning!
I tried **to reduce the possibility of optimizing** the launch of each test **by JavaScript engine**. Each test will be run in turn, and after running the last test, we return to the beginning and repeat. **In theory**, this launch option will not allow **the engine to cache the execution** of one test, and then repeat it for the next 10,000 iterations (or how many there will be).
:::

<style>
.custom-benchmarks-block li::marker {
  font-size: 0;
}
</style>

<div class="custom-benchmarks-block">

<!-- @include: ../../.autogenerate/benchmarks-results.md -->

</div>
