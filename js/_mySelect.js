const getSelectTemplate = (data, placeholder, icon, selectedId) => {
	let text = placeholder ?? 'Select placeholder'

	const defaultIcon = `
		<svg width="16" height="9" viewBox="0 0 40 22" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M36.5 0.799991C31.4 5.89999 26.4 11 21.3 16.1C21 16.4 20.8 16.6 20.5 16.9C15.9 12.3 11.3 7.69999 6.6 2.99999C5.9 2.29999 5.1 1.49999 4.4 0.799991C2.6 -1.00001 -0.299998 1.79999 1.6 3.59999C6.7 8.69999 11.8 13.8 16.9 18.9C17.6 19.6 18.4 20.4 19.1 21.1C19.9 21.9 21.2 21.9 21.9 21.1C27 16 32.1 11 37.2 5.89999C37.9 5.19999 38.7 4.39999 39.4 3.69999C41.2 1.89999 38.4 -1.00001 36.5 0.799991Z"/>
		</svg>
	`

	const arrow = icon ?? defaultIcon

	const items = data
		.map(item => {
			let isSelect = ''

			if (item.id === selectedId) {
				text = item.value
				isSelect = 'is_selected'
			}

			return `
				<li 
					class="my-select__item ${isSelect}" 
					data-type="item"
					title="${item.value}"
					data-item-id="${item.id}"
				>
					<span class="y-line-clamp-1">${item.value}</span>
				</li>
			`
		})
		.join('')

	return `
		<div class="my-select__backdrop" data-type="backdrop"></div>
		<div class="my-select__input" data-type="input" title="${text}">
			<div 
				class="my-select__text"
				data-type="value"
			>
				<span class="y-line-clamp-1">${text}</span>
			</div>
			<div class="my-select__icn"> 
				${arrow}
			</div>
		</div>
		<div class="my-select__dropdown">                    
			<div class="my-select__inner">
				<ul class="my-select__list">
					${items}
				</ul>
			</div>
		</div>
	`
}

export class MySelect {
	constructor(selector, options) {
		this.$selector = document.querySelector(selector)
		this.options = options
		this.data = this.options.data ?? []
		this.selectedId = String(this.options.selectedId)

		this.#render()
		this.#setup()
	}

	#render() {
		const { placeholder, arrow } = this.options
		const { select } = this.$selector.dataset
		const children = this.$selector.children

		for (let option of children) {
			this.data.push({
				id: option.value,
				value: option.textContent,
			})
		}

		this.$selector.outerHTML = `<div class="my-select" data-select="${select}"></div>`

		this.$el = document.querySelector(`[data-select="${select}"]`)
		this.$el.innerHTML = getSelectTemplate(
			this.data,
			placeholder,
			arrow,
			this.selectedId
		)
	}

	#setup() {
		this.clickHandler = this.clickHandler.bind(this)
		this.$el.addEventListener('click', this.clickHandler)
		this.$value = this.$el.querySelector('[data-type="value"] > *')
	}

	get isOpen() {
		return this.$el.classList.contains('is_open')
	}

	get isCurrent() {
		return this.data.find(item => String(item.id) === String(this.selectedId))
	}

	clickHandler(event) {
		const { target } = event
		const { type } = target.dataset
		if (type === 'input') {
			this.toggle()
		} else if (type === 'item') {
			this.select(target.dataset.itemId)
		} else if (type === 'backdrop') {
			this.close()
		}
	}

	toggle() {
		this.isOpen ? this.close() : this.open()
	}

	open() {
		this.$el.classList.add('is_open')
		this.$el.style.zIndex = 15
		this.options.onOpen ? this.options.onOpen(this.$el, this.isCurrent) : null
	}

	close() {
		this.$el.classList.remove('is_open')
		setTimeout(() => (this.$el.style.zIndex = ''), 275)
		this.options.onClose ? this.options.onClose(this.$el, this.isCurrent) : null
	}

	select(id) {
		this.selectedId = String(id)

		const isCurrentValue = this.isCurrent?.value

		if (!isCurrentValue) {
			console.error(`Error, non-existent "id" - ${id}`)
		}

		const itemId = isCurrentValue ? String(id) : String(this.data.at(0).id)
		const itemValue = isCurrentValue
			? this.isCurrent?.value
			: this.data.at(0).value

		this.selectedId = itemId
		this.$value.textContent = itemValue

		this.$el
			.querySelectorAll('[data-type="item"]')
			.forEach(item => item.classList.remove('is_selected'))
		this.$el
			.querySelector(`[data-item-id="${itemId}"]`)
			.classList.add('is_selected')
		this.options.onSelect
			? this.options.onSelect(this.$el, this.isCurrent)
			: null

		this.close()
	}

	update() {
		const { placeholder, arrow } = this.options
		this.$el.innerHTML = getSelectTemplate(
			this.data,
			placeholder,
			arrow,
			this.selectedId
		)
		this.$value = this.$el.querySelector('[data-type="value"] > *')
	}

	destroy() {
		this.$el.removeEventListener('click', this.clickHandler)
		this.$el.remove()
		this.options.onDestroy
			? this.options.onDestroy(this.$el, this.isCurrent)
			: null
	}
}
