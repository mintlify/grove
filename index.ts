const parser = require('./parser');

export type TreeNode = {
  kind: string;
  value: string;
  start: number;
  end: number;
  is_error: boolean,
  children: TreeNode[],
}

export type Program = {
  has_error: boolean;
  root: TreeNode;
}

export default (code: string, languageId: string): Program => {
  const tree = parser.parse(code, languageId);
  return JSON.parse(tree);
}