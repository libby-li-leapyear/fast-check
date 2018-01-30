import Arbitrary from '../arbitrary/definition/Arbitrary'
import Shrinkable from '../arbitrary/definition/Shrinkable'
import { tuple } from '../arbitrary/TupleArbitrary'
import MutableRandomGenerator from '../../random/generator/MutableRandomGenerator'
import IProperty from './IProperty'

export class AsyncProperty<Ts> implements IProperty<Ts> {
    constructor(readonly arb: Arbitrary<Ts>, readonly predicate: (t: Ts) => Promise<boolean | void>) { }
    isAsync = () => true;
    generate(mrng: MutableRandomGenerator): Shrinkable<Ts> {
        return this.arb.generate(mrng);
    }
    async run(v: Ts): Promise<string|null> {
        try {
            const output = await this.predicate(v);
            return output == null || output == true ? null : "Property failed by returning false";
        }
        catch (err) {
            if (err instanceof Error && err.stack)
                return `${err}\n\nStack trace: ${err.stack}`
            return `${err}`;
        }
    }
}

function asyncProperty<T1>(
    arb1: Arbitrary<T1>,
    predicate: (t1:T1) => Promise<boolean|void>
): AsyncProperty<[T1]>;

function asyncProperty<T1,T2>(
    arb1: Arbitrary<T1>,
    arb2: Arbitrary<T2>,
    predicate: (t1:T1,t2:T2) => Promise<boolean|void>
): AsyncProperty<[T1,T2]>;

function asyncProperty<T1,T2,T3>(
    arb1: Arbitrary<T1>,
    arb2: Arbitrary<T2>,
    arb3: Arbitrary<T3>,
    predicate: (t1:T1,t2:T2,t3:T3) => Promise<boolean|void>
): AsyncProperty<[T1,T2,T3]>;

function asyncProperty<T1,T2,T3,T4>(
    arb1: Arbitrary<T1>,
    arb2: Arbitrary<T2>,
    arb3: Arbitrary<T3>,
    arb4: Arbitrary<T4>,
    predicate: (t1:T1,t2:T2,t3:T3,t4:T4) => Promise<boolean|void>
): AsyncProperty<[T1,T2,T3,T4]>;

function asyncProperty<T1,T2,T3,T4,T5>(
    arb1: Arbitrary<T1>,
    arb2: Arbitrary<T2>,
    arb3: Arbitrary<T3>,
    arb4: Arbitrary<T4>,
    arb5: Arbitrary<T5>,
    predicate: (t1:T1,t2:T2,t3:T3,t4:T4,t5:T5) => Promise<boolean|void>
): AsyncProperty<[T1,T2,T3,T4,T5]>;

function asyncProperty<T1,T2,T3,T4,T5,T6>(
    arb1: Arbitrary<T1>,
    arb2: Arbitrary<T2>,
    arb3: Arbitrary<T3>,
    arb4: Arbitrary<T4>,
    arb5: Arbitrary<T5>,
    arb6: Arbitrary<T6>,
    predicate: (t1:T1,t2:T2,t3:T3,t4:T4,t5:T5,t6:T6) => Promise<boolean|void>
): AsyncProperty<[T1,T2,T3,T4,T5,T6]>;

function asyncProperty<T1,T2,T3,T4,T5,T6,T7>(
    arb1: Arbitrary<T1>,
    arb2: Arbitrary<T2>,
    arb3: Arbitrary<T3>,
    arb4: Arbitrary<T4>,
    arb5: Arbitrary<T5>,
    arb6: Arbitrary<T6>,
    arb7: Arbitrary<T7>,
    predicate: (t1:T1,t2:T2,t3:T3,t4:T4,t5:T5,t6:T6,t7:T7) => Promise<boolean|void>
): AsyncProperty<[T1,T2,T3,T4,T5,T6,T7]>;

function asyncProperty<T1,T2,T3,T4,T5,T6,T7,T8>(
    arb1: Arbitrary<T1>,
    arb2: Arbitrary<T2>,
    arb3: Arbitrary<T3>,
    arb4: Arbitrary<T4>,
    arb5: Arbitrary<T5>,
    arb6: Arbitrary<T6>,
    arb7: Arbitrary<T7>,
    arb8: Arbitrary<T8>,
    predicate: (t1:T1,t2:T2,t3:T3,t4:T4,t5:T5,t6:T6,t7:T7,t8:T8) => Promise<boolean|void>
): AsyncProperty<[T1,T2,T3,T4,T5,T6,T7,T8]>;

function asyncProperty<T1,T2,T3,T4,T5,T6,T7,T8,T9>(
    arb1: Arbitrary<T1>,
    arb2: Arbitrary<T2>,
    arb3: Arbitrary<T3>,
    arb4: Arbitrary<T4>,
    arb5: Arbitrary<T5>,
    arb6: Arbitrary<T6>,
    arb7: Arbitrary<T7>,
    arb8: Arbitrary<T8>,
    arb9: Arbitrary<T9>,
    predicate: (t1:T1,t2:T2,t3:T3,t4:T4,t5:T5,t6:T6,t7:T7,t8:T8,t9:T9) => Promise<boolean|void>
): AsyncProperty<[T1,T2,T3,T4,T5,T6,T7,T8,T9]>;

function asyncProperty<T1,T2,T3,T4,T5,T6,T7,T8,T9>(
    arb1: Arbitrary<T1>,
    arb2: Arbitrary<T2> | ((t1:T1) => Promise<boolean|void>),
    arb3?: Arbitrary<T3> | ((t1:T1,t2:T2) => Promise<boolean|void>),
    arb4?: Arbitrary<T4> | ((t1:T1,t2:T2,t3:T3) => Promise<boolean|void>),
    arb5?: Arbitrary<T5> | ((t1:T1,t2:T2,t3:T3,t4:T4) => Promise<boolean|void>),
    arb6?: Arbitrary<T6> | ((t1:T1,t2:T2,t3:T3,t4:T4,t5:T5) => Promise<boolean|void>),
    arb7?: Arbitrary<T7> | ((t1:T1,t2:T2,t3:T3,t4:T4,t5:T5,t6:T6) => Promise<boolean|void>),
    arb8?: Arbitrary<T8> | ((t1:T1,t2:T2,t3:T3,t4:T4,t5:T5,t6:T6,t7:T7) => Promise<boolean|void>),
    arb9?: Arbitrary<T9> | ((t1:T1,t2:T2,t3:T3,t4:T4,t5:T5,t6:T6,t7:T7,t8:T8) => Promise<boolean|void>),
    predicate?: (t1:T1,t2:T2,t3:T3,t4:T4,t5:T5,t6:T6,t7:T7,t8:T8,t9:T9) => Promise<boolean|void>
) {
    if (predicate) {
        const p = predicate as (t1:T1,t2:T2,t3:T3,t4:T4,t5:T5,t6:T6,t7:T7,t8:T8,t9:T9) => Promise<boolean|void>;
        return new AsyncProperty(tuple(
            arb1 as Arbitrary<T1>,
            arb2 as Arbitrary<T2>,
            arb3 as Arbitrary<T3>,
            arb4 as Arbitrary<T4>,
            arb5 as Arbitrary<T5>,
            arb6 as Arbitrary<T6>,
            arb7 as Arbitrary<T7>,
            arb8 as Arbitrary<T8>,
            arb9 as Arbitrary<T9>
        ), t => p(t[0],t[1],t[2],t[3],t[4],t[5],t[6],t[7],t[8]));
    }
    if (arb9) {
        const p = arb9 as (t1:T1,t2:T2,t3:T3,t4:T4,t5:T5,t6:T6,t7:T7,t8:T8) => Promise<boolean|void>;
        return new AsyncProperty(tuple(
            arb1 as Arbitrary<T1>,
            arb2 as Arbitrary<T2>,
            arb3 as Arbitrary<T3>,
            arb4 as Arbitrary<T4>,
            arb5 as Arbitrary<T5>,
            arb6 as Arbitrary<T6>,
            arb7 as Arbitrary<T7>,
            arb8 as Arbitrary<T8>
        ), t => p(t[0],t[1],t[2],t[3],t[4],t[5],t[6],t[7]));
    }
    if (arb8) {
        const p = arb8 as (t1:T1,t2:T2,t3:T3,t4:T4,t5:T5,t6:T6,t7:T7) => Promise<boolean|void>;
        return new AsyncProperty(tuple(
            arb1 as Arbitrary<T1>,
            arb2 as Arbitrary<T2>,
            arb3 as Arbitrary<T3>,
            arb4 as Arbitrary<T4>,
            arb5 as Arbitrary<T5>,
            arb6 as Arbitrary<T6>,
            arb7 as Arbitrary<T7>
        ), t => p(t[0],t[1],t[2],t[3],t[4],t[5],t[6]));
    }
    if (arb7) {
        const p = arb7 as (t1:T1,t2:T2,t3:T3,t4:T4,t5:T5,t6:T6) => Promise<boolean|void>;
        return new AsyncProperty(tuple(
            arb1 as Arbitrary<T1>,
            arb2 as Arbitrary<T2>,
            arb3 as Arbitrary<T3>,
            arb4 as Arbitrary<T4>,
            arb5 as Arbitrary<T5>,
            arb6 as Arbitrary<T6>
        ), t => p(t[0],t[1],t[2],t[3],t[4],t[5]));
    }
    if (arb6) {
        const p = arb6 as (t1:T1,t2:T2,t3:T3,t4:T4,t5:T5) => Promise<boolean|void>;
        return new AsyncProperty(tuple(
            arb1 as Arbitrary<T1>,
            arb2 as Arbitrary<T2>,
            arb3 as Arbitrary<T3>,
            arb4 as Arbitrary<T4>,
            arb5 as Arbitrary<T5>
        ), t => p(t[0],t[1],t[2],t[3],t[4]));
    }
    if (arb5) {
        const p = arb5 as (t1:T1,t2:T2,t3:T3,t4:T4) => Promise<boolean|void>;
        return new AsyncProperty(tuple(
            arb1 as Arbitrary<T1>,
            arb2 as Arbitrary<T2>,
            arb3 as Arbitrary<T3>,
            arb4 as Arbitrary<T4>
        ), t => p(t[0],t[1],t[2],t[3]));
    }
    if (arb4) {
        const p = arb4 as (t1:T1,t2:T2,t3:T3) => Promise<boolean|void>;
        return new AsyncProperty(tuple(
            arb1 as Arbitrary<T1>,
            arb2 as Arbitrary<T2>,
            arb3 as Arbitrary<T3>
        ), t => p(t[0],t[1],t[2]));
    }
    if (arb3) {
        const p = arb3 as (t1:T1,t2:T2) => Promise<boolean|void>;
        return new AsyncProperty(tuple(
            arb1 as Arbitrary<T1>,
            arb2 as Arbitrary<T2>
        ), t => p(t[0],t[1]));
    }
    const p = arb2 as (t1:T1) => Promise<boolean|void>;
    return new AsyncProperty(tuple(arb1), t => p(t[0]));
}

export { asyncProperty };