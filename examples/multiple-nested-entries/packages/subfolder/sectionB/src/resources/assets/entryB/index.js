import has from 'lodash/has'

const foo = {
	bar: 'WORLD',
	baz: 'OKAY'
}

console.log("Section B", "Entry B", has(foo, 'bar'));