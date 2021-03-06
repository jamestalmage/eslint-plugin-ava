import test from 'ava';
import {RuleTester} from 'eslint';
import rule from '../rules/no-invalid-end';

const ruleTester = new RuleTester({
	env: {
		es6: true
	}
});

const errors = [{ruleId: 'no-invalid-end'}];
const header = `const test = require('ava');\n`;

test(() => {
	ruleTester.run('no-invalid-end', rule, {
		valid: [
			header + 'test(t => {});',
			header + 'test(t => { t.is(1, 1); });',
			header + 'test.only(t => {});',
			header + 'test.cb(t => { t.end(); });',
			header + 'test.cb(t => { t.end.skip(); });',
			header + 'test.cb.only(t => { t.end(); });',
			header + 'notTest(t => { t.end(); });',
			// shouldn't be triggered since it's not a test file
			'test(t => { t.end(); });'
		],
		invalid: [
			{
				code: header + 'test(t => { t.end(); });',
				errors
			},
			{
				code: header + 'test.only(t => { t.end(); });',
				errors
			},
			{
				code: header + 'test(t => { t.end.skip(); });',
				errors
			}
		]
	});
});
