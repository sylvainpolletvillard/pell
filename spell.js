function spell() {
	let $ = (tag, className, props, children=[]) => {
		let elm = Object.assign(document.createElement(tag), {className}, props)
		children.map(child => child && elm.appendChild(child))
		return elm
	}

	let exec = (command, value=null) => document.execCommand(command, false, value)
	let ensureHTTP = url => /^https?:\/\//.test(url) ? url : `http://${url}`
	let colorPicker = () => $('input', '', { type: 'color' })
	let select = options => $('select', '', {}, options.map(o => $('option', '', { textContent:o })))

	let actions = [
		[
			['bold'],
			['italic'],
			['underline'],
			['strikeThrough'],
			['subscript'],
			['superscript'],
		],
		[
			['justifyLeft'],
			['justifyCenter'],
			['justifyRight'],
			['justifyFull'],
			['indent'],
			['outdent']
		],
		[
			['fontName', select(["Arial", "Helvetica", "Times", "Courier", "Verdana", "Impact"])],
			['fontSize', select([...Array(33)].map((_,i)=>8+i*2))],
			['forecolor', colorPicker()],
			['hilitecolor', colorPicker()]
		].map(([cmd, input]) => {
			input.onchange = () => exec(cmd, input.value)
			return [cmd, () => input.click(), [input]]
		}),
		[
			...[1, 2, 3, 4].map(n => ['Heading' + n, `<H${n}>`]),
			['paragraph', '<P>'],
			['quote', '<BLOCKQUOTE>'],
			['code', '<PRE>']
		].map(([title, format]) => [title, () => exec('formatBlock', format)]),
		[
			['insertOrderedList'],
			['insertUnorderedList'],
			['insertHorizontalRule'],
		],
		[
			['removeFormat'],
			['unlink']
		],
		[
			['createLink', 'link'],
			['insertImage','image'],
			['insertHTML', 'video', url => `<video controls src="${ensureHTTP(url)}">`]
		].map(([cmd, type, transform=ensureHTTP]) => [type, () => {
			let url = prompt(`Enter the ${type} URL`)
			url && exec(cmd, transform(url))
		}]),
		[
			['copy'],
			['cut'],
			['paste']
		],
		[
			['undo'],
			['redo']
		]
	]

	return $('div', 'spell', {}, [
		$('div', 'spell-bar', {}, actions.map(
			bar => $('div', 'spell-zone', {}, bar.map(
				([cmd, onclick = () => exec(cmd), children]) => $('button', 'spell-icon', {
					title: cmd.charAt(0).toUpperCase() + cmd.slice(1).replace(/([A-Z1-9])/g, ' $1'),
					innerHTML: `<i class="icon-${cmd.toLowerCase()}"></i>`,
					onclick
				}, children)
			))
		)),
		$('div', 'spell-content', {
			contentEditable: true,
			onkeydown: event => event.which !== 9
		})
	])

}