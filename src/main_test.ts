import {
  assertEquals,
  remarkParse,
  remarkStringify,
  unified,
} from "../deps.ts";

import remarkUnwrap from "./main.ts";

const pipeline = unified()
  .use(remarkParse)
  .use(remarkUnwrap, {
    childTest: (node, _, parent) =>
      parent?.type == "link" && !parent.url && !parent.title,
    parentTest: undefined,
  })
  .use(remarkStringify);

Deno.test("one child in void link", async () => {
  const input = "[foobar]()";
  const expected = "foobar[]()\n";

  const actual = (await pipeline
    .process(input)).toString();

  assertEquals(actual, expected);
});

Deno.test("one nested child in void link", async () => {
  const input = "[**foobar**]()";
  const expected = "**foobar**[]()\n";

  const actual = (await pipeline
    .process(input)).toString();

  assertEquals(actual, expected);
});

Deno.test("two nested children in void link", async () => {
  const input = "[**foo****bar**]()";
  const expected = "**foo****bar**[]()\n";

  const actual = (await pipeline
    .process(input)).toString();

  assertEquals(actual, expected);
});

Deno.test("root edge case", async () => {
  const input = "foo";
  const expected = "foo\n";

  const actual = (await unified()
    .use(remarkParse)
    .use(remarkUnwrap, {
      childTest: (node) => true,
      parentTest: (node) => true,
    })
    .use(remarkStringify)
    .process(input)).toString();

  assertEquals(actual, expected);
});
