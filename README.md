# README

Remark plugin that unwraps first and last child nodes from parent nodes



## Features

- unwraps a child node from its parent node if it's the first or last child
- child and parent are defined using a [`Test`](https://github.com/syntax-tree/unist-util-is#test)



## Example

To unwrap child nodes from hyperlinks without URL

```js
import { unified, remarkParse, remarkStringify } from "./deps.ts";
import remarkUnwrap from "./src/main.ts";

const result = (await unified()
  .use(remarkParse)
  .use(remarkUnwrap, {
    childTest: (node, _, parent) =>
      parent?.type == "link" && !parent.url && !parent.title,
    parentTest: undefined,
  })
  .use(remarkStringify)
  .process(`[foobar]()`))
  .toString();
console.log(result);
```

Before

```md
[foobar]()
```

After

```md
foobar[]()
```
