
declare module '@editorjs/marker' {
    import { IBlockTool, IBlockToolConstructor } from '@editorjs/editorjs';
  
    class Marker implements IBlockTool {
      constructor(config: any);
    }
  
    declare const MarkerTool: IBlockToolConstructor<Marker>;
  
    export default MarkerTool;
  }