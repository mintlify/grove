use std::path::PathBuf;

fn main() {
    let phpdir: PathBuf = ["sitters", "php", "src"].iter().collect();
    cc::Build::new()
        .include(&phpdir)
        .file(phpdir.join("parser.c"))
        .file(phpdir.join("scanner.cc"))
        .compile("tree-sitter-php");
    
    let javadir: PathBuf = ["sitters", "java", "src"].iter().collect();
    cc::Build::new()
        .include(&javadir)
        .file(javadir.join("parser.c"))
        .compile("tree-sitter-java");

    let csharpdir: PathBuf = ["sitters", "csharp", "src"].iter().collect();
    cc::Build::new()
        .include(&csharpdir)
        .file(csharpdir.join("parser.c"))
        .file(csharpdir.join("scanner.c"))
        .compile("tree-sitter-c-sharp");

    let dartdir: PathBuf = ["sitters", "dart", "src"].iter().collect();
    cc::Build::new()
        .include(&dartdir)
        .file(dartdir.join("parser.c"))
        .file(dartdir.join("scanner.c"))
        .compile("tree-sitter-dart");

    let rubydir: PathBuf = ["sitters", "ruby", "src"].iter().collect();
    cc::Build::new()
        .include(&rubydir)
        .file(rubydir.join("parser.c"))
        .file(rubydir.join("scanner.cc"))
        .compile("tree-sitter-ruby");
}