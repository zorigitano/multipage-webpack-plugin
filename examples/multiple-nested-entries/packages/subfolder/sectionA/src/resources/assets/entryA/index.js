import has from 'lodash/has'

const foo = {
	bar: 'WORLD',
	baz: 'OKAY'
}

console.log("Section A", "Entry A", has(foo, 'bar'));