// Import basic basic testing functions (import or remove functions as needed)
import {
  test,
  expect,
  describe,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
} from "vitest";

// Import additional dependencies here (e.g. bcrypt)
// ex. Import bcrypt from 'bcrypt';

// Import functions, components, or units to be tested here (e.g. createUser())
// ex. Import { createUser(), updateUser() } from "<path_to>/userController.js";

/*
 * describe() should be used to group a set of unit tests that tests a single unit of
 * code.
 */
describe("<describe the unit or component to be tested...>", () => {
  /*
   * beforeAll() should be used when setup before running a TEST SUITE is
   * needed. (make it async as needed, remove if not needed)
   */
  beforeAll(() => {});

  /*
   * afterAll() should be used when clean up after running a TEST SUITE is
   * needed. (make it async as needed, remove if not needed)
   */
  afterAll(() => {});

  /*
   * beforeAll() should be used when setup before executing INDIVIDUAL TESTS is
   * needed. (make it async as needed, remove if not needed)
   */
  beforeEach(() => {});

  /*
   * afterAll() should be used when clean up after running an INDIVIDUAL TEST is
   * needed. (make it async as needed, remove if not needed)
   */
  afterEach(() => {});

  /*
   * test() should be used when writing a single unit test. (make it async as
   * needed)
   */
  test("<describe the unit test of the unit or component here...>", () => {
    /*
     * input is used to store the expected input of the function/component being
     * tested. (define input as needed)
     */
    const input = undefined;

    /*
     * output is used to store the expected output of the function/component
     * being tested. (define output as needed)
     */
    const output = undefined;

    /*
     * output is used to store the mocked/simulated output of a function,
     * component, or service being mocked. (defined mock as needed, delete if
     * not needed)
     */
    const mock = undefined;

    // mocked component/service here as needed

    /*
     * expect() and other assertion functions (e.g. toEqual()) is used to
     * check if the value observed result is matches the expected result. (make
     * it async as needed)
     */
    expect().toEqual();
  });
});
