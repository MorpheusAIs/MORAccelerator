declare module 'aos' {
  interface AosOptions {
    offset?: number;
    delay?: number;
    duration?: number;
    easing?: string;
    once?: boolean;
    mirror?: boolean;
    anchorPlacement?: string;
    startEvent?: string;
    animatedClassName?: string;
    initClassName?: string;
    useClassNames?: boolean;
    disableMutationObserver?: boolean;
    throttleDelay?: number;
    debounceDelay?: number;
  }

  interface AOS {
    init(options?: AosOptions): void;
    refresh(hard?: boolean): void;
    refreshHard(): void;
  }

  const aos: AOS;
  export default aos;
}
