// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	namespace svelteHTML {
		interface IntrinsicElements {
			'lord-icon': {
				src?: string;
				trigger?: string;
				delay?: string | number;
				colors?: string;
				style?: string;
				class?: string;
				target?: string;
				stroke?: string | number;
				state?: string;
			};
		}
	}
}

export {};
