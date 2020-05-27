[Home](/) &gt; [fast-check](../fast-check.md) &gt; [constantFrom](constantFrom_1.md)

## constantFrom() function

For one `...values` values - all equiprobable

\*\*WARNING\*\*: It expects at least one value, otherwise it should throw

<b>Signature:</b>

```typescript
declare function constantFrom<T>(...values: T[]): Arbitrary<T>;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  values | <code>T[]</code> | Constant values to be produced (all values shrink to the first one) |

<b>Returns:</b>

`Arbitrary<T>`

