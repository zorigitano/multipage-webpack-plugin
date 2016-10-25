import has from 'lodash/has'

const foo = {
	bar: 'WORLD',
	baz: 'OKAY'
}

console.log("Module B", has(foo, 'bar'));