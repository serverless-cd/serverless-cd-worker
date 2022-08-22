const path = require("path");
const fs = require("fs");
const yaml = require("yaml");
const execa = require("execa");

// const pipeLine = fs.readFileSync(path.join(process.cwd(), "./pipeline.yaml"));

// console.log(yaml.parse(pipeLine.toString()).job);


describe("My Test Suite", () => {
  it("My Test Case", async () => {
    const {stdout} = await execa('echo', ['unicorns']);
    console.log(stdout);
    expect(true).toEqual(true);
  });
});
