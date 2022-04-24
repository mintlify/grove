#[macro_use] extern crate serde_derive;

use neon::prelude::*;
use tree_sitter::{Language, Parser, Node, Tree};
extern crate serde;
extern crate serde_json;
extern "C" { fn tree_sitter_php() -> Language; }
extern "C" { fn tree_sitter_java() -> Language; }
extern "C" { fn tree_sitter_c_sharp() -> Language; }
extern "C" { fn tree_sitter_dart() -> Language; }
extern "C" { fn tree_sitter_ruby() -> Language; }

#[derive(Serialize, Deserialize, Debug)]
struct Program {
    has_error: bool,
    root: CustomNode,
  }

#[derive(Serialize, Deserialize, Debug)]
struct CustomNode {
    kind: String,
    value: String,
    start: usize,
    end: usize,
    is_error: bool,
    children: Option<Vec<CustomNode>>,
  }

fn get_tree(code: &str, language_id: &str) -> Tree {
    let mut parser = Parser::new();
    let language = match language_id {
      "typescript" => tree_sitter_typescript::language_typescript(),
      "javascript" => tree_sitter_javascript::language(),
      "python" => tree_sitter_python::language(),
      "kotlin" => tree_sitter_kotlin::language(),
      "c" => tree_sitter_c::language(),
      "cpp" => tree_sitter_cpp::language(),
      "rust" => tree_sitter_rust::language(),
      "php" => unsafe { tree_sitter_php() },
      "java" => unsafe { tree_sitter_java() },
      "csharp" => unsafe { tree_sitter_c_sharp() },
      "dart" => unsafe { tree_sitter_dart() },
      "ruby" => unsafe { tree_sitter_ruby() },
      "go" => tree_sitter_go::language(),
      // Default to TS parser
      _ => tree_sitter_typescript::language_typescript()
    };
    parser.set_language(language).expect("Error loading grammar");
    return parser.parse(code, None).unwrap();
  }
  
  fn reconstruct(node: Node, code: &str) -> CustomNode {
    let mut children = Vec::new();
    let children_count = node.child_count();
    for i in 0..children_count {
      let child = node.child(i);
      match child {
        None => (),
        Some(child) => children.push(reconstruct(child, code)),
      }
    }
  
    return CustomNode {
      kind: node.kind().to_string(),
      value: code[node.start_byte()..node.end_byte()].to_string(),
      start: node.start_byte(),
      end: node.end_byte(),
      is_error: node.is_error(),
      children: if children_count > 0 { Some(children) } else { None },
    }
  }

fn parse(mut cx: FunctionContext) -> JsResult<JsString> {
    let code: String = cx.argument::<JsString>(0)?.value(&mut cx);
    let language_id: String = cx.argument::<JsString>(1)?.value(&mut cx);
    
    let tree: Tree = get_tree(code.as_str(), language_id.as_str());
    let root_node = tree.root_node();
    let root = reconstruct(root_node, code.as_str());
    let program = Program {
        has_error: root_node.has_error(),
        root,
    };

    let serialized = serde_json::to_string(&program).unwrap();
    Ok(cx.string(serialized))
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("parse", parse)?;
    Ok(())
}
