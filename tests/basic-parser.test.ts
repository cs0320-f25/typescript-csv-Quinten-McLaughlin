import { parseCSV } from "../src/basic-parser";
import * as path from "path";
import { ZodError } from "zod";
import {
  StudentSchema,
  ProductSchema,
  type Student,
  type Product,
} from "../data/schemas";

const PEOPLE_CSV_PATH = path.join(__dirname, "../data/people.csv");
const PEOPLE_QUOTES_CSV_PATH = path.join(__dirname, "../data/people_quotes.csv");
const PEOPLE_COMMAS_CSV_PATH = path.join(__dirname, "../data/people_commas.csv");
const PEOPLE_EMPTY_CSV_PATH = path.join(__dirname, "../data/people_empty_column.csv");
const PEOPLE_UNFINISHED_QUOTES_CSV_PATH = path.join(__dirname, "../data/people_unfinished_quotes.csv");
const PEOPLE_WHITESPACE_CSV_PATH = path.join(__dirname, "../data/people_whitespace.csv");
const STUDENTS_CSV_PATH = path.join(__dirname, "../data/students.csv");
const PRODUCTS_CSV_PATH = path.join(__dirname, "../data/products.csv");
const STUDENTS_NO_HEADER_CSV_PATH = path.join(__dirname, "../data/students_no_header.csv");
const PRODUCTS_NO_HEADER_CSV_PATH = path.join(__dirname, "../data/products_no_header.csv");

// Purpose: baseline shape check for no-schema parsing (raw string[][]).
// Current: PASSES (returns 6 rows incl. header as strings). Ideal: PASS (unchanged).
test("parseCSV yields arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  
  expect(results).toHaveLength(6);
  expect(results[0]).toEqual(["name", "age"]);
  expect(results[1]).toEqual(["Alice", "23"]);
  expect(results[2]).toEqual(["Bob", "thirty"]); // why does this work? :(
  expect(results[3]).toEqual(["Charlie", "25"]);
  expect(results[4]).toEqual(["Nim", "22"]);
  expect(results[5]).toEqual(["John", "hello"]);
});

// Purpose: every row is an array when no schema is supplied.
// Current: PASSES. Ideal: PASS.
test("parseCSV yields only arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  for(const row of results) {
    expect(Array.isArray(row)).toBe(true);
  }
});

// Purpose: asserts header is skipped (data-only output) without schema.
// Current: FAILS (header is included). Ideal: should PASS once header-skip option is implemented.
test("parseCSV handles header row", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  expect(results[0]).toEqual(["Alice", "23"]);
})

// Purpose: confirm no-schema output is strings (not coerced).
// Current: PASSES. Ideal: PASS (coercion belongs in schema tests).
test("parseCSV outputs age as string", async () => {
  const results = (await parseCSV(PEOPLE_CSV_PATH)) as string[][];
  expect(typeof results[1][1]).toBe("string");
})

// Purpose: consumer-side numeric coercion sanity check on string output.
// Current: PASSES (Number("23") = 23, others NaN). Ideal: PASS (base parser remains strings).
test("parseCSV ensures age is number", async () => {
  const results = (await parseCSV(PEOPLE_CSV_PATH)) as string[][];
  expect(Number(results[1][1])).toBe(23);

  //this part fails currently
  expect(Number.isNaN(Number(results[2][1]))).toBe(true); // "thirty"
  expect(Number.isNaN(Number(results[5][1]))).toBe(true); // "hello"
})

// Purpose: quoted-field handling (strip outer quotes, handle doubled quotes).
// Current: FAILS (simple split/trim doesn’t parse quotes). Ideal: PASS after quoted-field support.
test("parseCSV handles double quotes", async () => {
  const results = (await parseCSV(PEOPLE_QUOTES_CSV_PATH)) as string[][];
  expect(results[2][1]).toBe("12"); // shouldn't be ""12"""
})

// Purpose: commas inside quoted fields should not create extra columns.
// Current: FAILS. Ideal: PASS after quoted-field support.
test("parseCSV handles commas", async () => {
  const results = (await parseCSV(PEOPLE_COMMAS_CSV_PATH)) as string[][];
  expect(results[2][1]).toBe("12,5,4"); // shouldn't create new columns
})

// Purpose: empty cells are preserved as empty strings.
// Current: PASSES. Ideal: PASS.
test("parseCSV handles empty fields", async () => {
  // results[2] should equal ["Yeet","","23"]
  const results = (await parseCSV(PEOPLE_EMPTY_CSV_PATH)) as string[][];
  expect(results[2][0]).toBe("Yeet");
  expect(results[2][1]).toBe("");
  expect(results[2][2]).toBe("23")
})

// Purpose: malformed input (unfinished quotes) should be detected.
// Current: FAILS (no error; naive split). Ideal: should THROW (later update test to expect error).
test("parseCSV handles unfinished quotes", async () => {
  const results = (await parseCSV(PEOPLE_UNFINISHED_QUOTES_CSV_PATH)) as string[][];
  expect(results[2][1]).toBe("30");
})


// Purpose: trims leading/trailing whitespace around values.
// Current: PASSES (uses .trim()). Ideal: PASS.
test("parseCSV handles whitespace", async () => {
  const results = (await parseCSV(PEOPLE_WHITESPACE_CSV_PATH)) as string[][];
  expect(results[2][0]).toBe("Bob"); //instead of "Bob "
  expect(results[2][1]).toBe("30"); //instead of " 30"
})

/* ----------------------------
          with schema
   ---------------------------- */

// STUDENT
// Purpose: happy-path schema parse into Student[] (no header).
// Current: PASSES (coercion + transform). Ideal: PASS.
test("parseCSV(StudentSchema) parses students_no_header.csv into Student[]", async () => {
  const results = (await parseCSV(
    STUDENTS_NO_HEADER_CSV_PATH,
    StudentSchema
  )) as Student[];

  expect(results).toHaveLength(2);
  expect(results[0]).toEqual({
    name: "Alice",
    credits: 5,
    email: "alice@brown.edu"   // ← this trailing comma can trigger TS parser errors
  });
  expect(results[1].credits).toBe(12);
});

// STUDENT
// Purpose: schema should reject files that include a header row.
// Current: PASSES (throws ZodError). Ideal: PASS until header-skip is added (then test should change).
test("parseCSV(StudentSchema) rejects students.csv (has header row)", async () => {
  await expect(
    parseCSV(STUDENTS_CSV_PATH, StudentSchema)).rejects.toBeInstanceOf(ZodError);
});

// STUDENT
// Purpose: schema coercion (credits→number) and basic shape (email).
// Current: PASSES. Ideal: PASS.
test("parseCSV(StudentSchema) coerces credits to number and preserves email shape", async () => {
  const results = (await parseCSV(
    STUDENTS_NO_HEADER_CSV_PATH,
    StudentSchema
  )) as Student[];

  expect(typeof results[0].credits).toBe("number");
  expect(results[0].credits).toBe(5);
  expect(results[1].email).toMatch(/@brown\.edu$/);
});

// PRODUCT
// Purpose: happy-path schema parse into Product[] (no header).
// Current: PASSES. Ideal: PASS.
test("parseCSV(ProductSchema) parses products_no_header.csv into Product[]", async () => {
  const results = (await parseCSV(
    PRODUCTS_NO_HEADER_CSV_PATH,
    ProductSchema
  )) as Product[];

  expect(results).toHaveLength(2);
  expect(results[0]).toEqual({
    product_name: "shampoo",
    id: "001",
    price: 9.99,
    in_stock: true,
  });
  expect(results[1].in_stock).toBe(false);
});

// PRODUCT
// Purpose: schema should reject files that include a header row.
// Current: PASSES (throws ZodError). Ideal: PASS until header-skip is added (then test should change).
test("parseCSV(ProductSchema) rejects products.csv (has header row)", async () => {
  await expect(parseCSV(PRODUCTS_CSV_PATH, ProductSchema)).rejects.toBeInstanceOf(
    ZodError
  );
});

// PRODUCT
// Purpose: schema coercion checks (price→number, in_stock→boolean).
// Current: PASSES. Ideal: PASS.
test("parseCSV(ProductSchema) coerces price to number and in_stock to boolean", async () => {
  const results = (await parseCSV(
    PRODUCTS_NO_HEADER_CSV_PATH,
    ProductSchema
  )) as Product[];

  const first = results[0];
  expect(typeof first.price).toBe("number");
  expect(typeof first.in_stock).toBe("boolean");
  expect(first.price).toBeCloseTo(9.99);
});
