import { MySelect } from './_mySelect.js'


const selectFrontEnd = [
    
    { id: '4', value: 'React Native' },
    { id: '5', value: 'Vuex' },
    { id: '6', value: 'Next' },
    { id: '7', value: 'Nest' },
    { id: '8', value: 'NodeJs' },
]

const frontEnd = new MySelect('[data-select="frontEnd"]', {
	placeholder: 'Выбери технологию frontEnd',
    arrow: `
        <svg width="12" height="8" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.145 1.235L0.235 1.34L7.035 9.165C7.265 9.43 7.61 9.595 7.995 9.595C8.38 9.595 8.725 9.425 8.955 9.165L15.75 1.355L15.865 1.225C15.95 1.1 16 0.95 16 0.79C16 0.355 15.63 0 15.17 0H0.83C0.37 0 0 0.355 0 0.79C0 0.955 0.0550001 1.11 0.145 1.235Z" />
        </svg>
    `,
    selectedId: '5',
	data: selectFrontEnd,
    onOpen($el, current) {
        console.log(`onOpen:`, $el, current)
    },
    onClose($el, current) {
        console.log(`onClose:`, $el, current)
    },
    onSelect($el, current) {
        console.log(`onSelect:`, $el, current)
    },
    onDestroy($el, current) {
        console.log(`onDestroy:`, $el, current)
    }
})

window.s = frontEnd


const backEnd = new MySelect('[data-select="cms"]', {
    placeholder: 'Выбери свою CMS'
})

window.s = backEnd


selectFrontEnd.push({id: 9, value: 'TypeScript'})
frontEnd.update()
frontEnd.select(3)