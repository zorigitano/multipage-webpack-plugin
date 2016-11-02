import has from 'lodash/has'

const foo = {
	bar: 'WORLD',
	baz: 'OKAY'
}

console.log("Section Core", "Entry A", has(foo, 'bar'));