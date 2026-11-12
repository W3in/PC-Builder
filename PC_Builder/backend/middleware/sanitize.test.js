const test = require('node:test');
const assert = require('node:assert');
const { strip, escapeRegex } = require('./sanitize');

test('strips mongo operators at any depth, keeps normal data', () => {
    const body = { email: { $gt: '' }, items: [{ qty: 1, $where: 'x' }], name: 'a' };
    strip(body);
    assert.deepStrictEqual(body, { email: {}, items: [{ qty: 1 }], name: 'a' });
});

test('escapeRegex makes user text literal', () => {
    assert.ok(new RegExp(escapeRegex('(a+)+$')).test('x(a+)+$'));
    assert.ok(!new RegExp(escapeRegex('.*')).test('abc'));
});
