// Types to get the project to compile.

/**
 * Default CSS definition for typescript,
 * will be overridden with file-specific definitions by rollup
 */
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

interface SvgrComponent extends React.StatelessComponent<React.SVGAttributes<SVGElement>> {}

declare module '*.svg' {
  const svgUrl: string;
  const svgComponent: SvgrComponent;
  export default svgUrl;
  export { svgComponent as ReactComponent }
}

declare module 'aphrodite-jss' {
  const StyleSheet: any;
  const css: any;
}

declare module 'react-tweenful' {
  const Tweenful: {
    span: any;
  };
  const elastic: any;
  const percentage: any;
  export default Tweenful;
  export { elastic, percentage };
}
