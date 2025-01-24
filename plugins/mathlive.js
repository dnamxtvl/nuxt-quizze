import { MathfieldElement } from 'mathlive';

export default defineNuxtPlugin(() => {
    if (!customElements.get('math-field')) {
        customElements.define('math-field', MathfieldElement);
    }
});
