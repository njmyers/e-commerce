declare module '*.graphql' {
  import type { DocumentNode } from 'graphql';
  let content: DocumentNode;
  export default content;
}
