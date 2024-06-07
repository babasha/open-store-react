declare module 'react-google-charts' {
    import { Component } from 'react';
  
    export interface ChartProps {
      width?: string;
      height?: string;
      chartType: string;
      loader?: JSX.Element;
      data: any[][];
      options?: object;
      rootProps?: object;
      chartEvents?: object[];
      // Add other props as needed
    }
  
    export class Chart extends Component<ChartProps> {}
  }
  