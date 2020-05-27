[Home](/) &gt; [fast-check](../fast-check.md) &gt; [bigInt](bigInt_2.md)

## bigInt() function

For any between min (included) and max (included)

<b>Signature:</b>

```typescript
declare function bigInt(min: any, max: any): ArbitraryWithShrink<any>;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  min | <code>any</code> | Lower bound for the generated integers (eg.: 0n, BigInt(Number.MIN\_SAFE\_INTEGER)) |
|  max | <code>any</code> | Upper bound for the generated integers (eg.: 2147483647n, BigInt(Number.MAX\_SAFE\_INTEGER)) |

<b>Returns:</b>

`ArbitraryWithShrink<any>`

