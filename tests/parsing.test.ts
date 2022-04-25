import parser from '../index.js';

describe('Simple parsing', () => {
  test('Simple JS console log', () => {
    const code = 'console.log("Hello world");';
    const languageId = 'javascript'
    const parsed = parser(code, languageId);
    expect(parsed).toStrictEqual({
      has_error: false,
      root: {
        kind: "program",
        value: "console.log(\"Hello world\");",
        start: 0,
        end: 27,
        is_error: false,
        children: [
           {
              kind: "expression_statement",
              value: "console.log(\"Hello world\");",
              start: 0,
              end: 27,
              is_error: false,
              children: [
                 {
                    kind: "call_expression",
                    value: "console.log(\"Hello world\")",
                    start: 0,
                    end: 26,
                    is_error: false,
                    children: [
                       {
                          kind: "member_expression",
                          value: "console.log",
                          start: 0,
                          end: 11,
                          is_error: false,
                          children: [
                             {
                                kind: "identifier",
                                value: "console",
                                start: 0,
                                end: 7,
                                is_error: false,
                                children: null
                             },
                             {
                                kind: ".",
                                value: ".",
                                start: 7,
                                end: 8,
                                is_error: false,
                                children: null
                             },
                             {
                                kind: "property_identifier",
                                value: "log",
                                start: 8,
                                end: 11,
                                is_error: false,
                                children: null
                             }
                          ]
                       },
                       {
                          kind: "arguments",
                          value: "(\"Hello world\")",
                          start: 11,
                          end: 26,
                          is_error: false,
                          children: [
                             {
                                kind: "(",
                                value: "(",
                                start: 11,
                                end: 12,
                                is_error: false,
                                children: null
                             },
                             {
                                kind: "string",
                                value: "\"Hello world\"",
                                start: 12,
                                end: 25,
                                is_error: false,
                                children: [
                                   {
                                      kind: "\"",
                                      value: "\"",
                                      start: 12,
                                      end: 13,
                                      is_error: false,
                                      children: null
                                   },
                                   {
                                      kind: "string_fragment",
                                      value: "Hello world",
                                      start: 13,
                                      end: 24,
                                      is_error: false,
                                      children: null
                                   },
                                   {
                                      kind: "\"",
                                      value: "\"",
                                      start: 24,
                                      end: 25,
                                      is_error: false,
                                      children: null
                                   }
                                ]
                             },
                             {
                                kind: ")",
                                value: ")",
                                start: 25,
                                end: 26,
                                is_error: false,
                                children: null
                             }
                          ]
                       }
                    ]
                 },
                 {
                    kind: ";",
                    value: ";",
                    start: 26,
                    end: 27,
                    is_error: false,
                    children: null
                 }
              ]
           }
        ]
     }
    })
  });

  test('Simple python function', () => {
    const code = `def hi(p1):
  return p1`;
    const languageId = 'python';
    const parsed = parser(code, languageId);
    expect(parsed).toStrictEqual({
      has_error: false,
      root: {
        kind: "module",
        value: "def hi(p1):\n  return p1",
        start: 0,
        end: 23,
        is_error: false,
        children: [
           {
              kind: "function_definition",
              value: "def hi(p1):\n  return p1",
              start: 0,
              end: 23,
              is_error: false,
              children: [
                 {
                    kind: "def",
                    value: "def",
                    start: 0,
                    end: 3,
                    is_error: false,
                    children: null
                 },
                 {
                    kind: "identifier",
                    value: "hi",
                    start: 4,
                    end: 6,
                    is_error: false,
                    children: null
                 },
                 {
                    kind: "parameters",
                    value: "(p1)",
                    start: 6,
                    end: 10,
                    is_error: false,
                    children: [
                       {
                          kind: "(",
                          value: "(",
                          start: 6,
                          end: 7,
                          is_error: false,
                          children: null
                       },
                       {
                          kind: "identifier",
                          value: "p1",
                          start: 7,
                          end: 9,
                          is_error: false,
                          children: null
                       },
                       {
                          kind: ")",
                          value: ")",
                          start: 9,
                          end: 10,
                          is_error: false,
                          children: null
                       }
                    ]
                 },
                 {
                    kind: ":",
                    value: ":",
                    start: 10,
                    end: 11,
                    is_error: false,
                    children: null
                 },
                 {
                    kind: "block",
                    value: "return p1",
                    start: 14,
                    end: 23,
                    is_error: false,
                    children: [
                       {
                          kind: "return_statement",
                          value: "return p1",
                          start: 14,
                          end: 23,
                          is_error: false,
                          children: [
                             {
                                kind: "return",
                                value: "return",
                                start: 14,
                                end: 20,
                                is_error: false,
                                children: null
                             },
                             {
                                kind: "identifier",
                                value: "p1",
                                start: 21,
                                end: 23,
                                is_error: false,
                                children: null
                             }
                          ]
                       }
                    ]
                 }
              ]
           }
        ]
     }
    })
  });

  test('Java variable declaration', () => {
    const code = 'int num = 1;';
    const languageId = 'java';
    const parsed = parser(code, languageId);
    expect(parsed).toStrictEqual({
      has_error: false,
      root: {
        kind: "program",
        value: "int num = 1;",
        start: 0,
        end: 12,
        is_error: false,
        children: [
           {
              kind: "local_variable_declaration",
              value: "int num = 1;",
              start: 0,
              end: 12,
              is_error: false,
              children: [
                 {
                    kind: "integral_type",
                    value: "int",
                    start: 0,
                    end: 3,
                    is_error: false,
                    children: [
                       {
                          kind: "int",
                          value: "int",
                          start: 0,
                          end: 3,
                          is_error: false,
                          children: null
                       }
                    ]
                 },
                 {
                    kind: "variable_declarator",
                    value: "num = 1",
                    start: 4,
                    end: 11,
                    is_error: false,
                    children: [
                       {
                          kind: "identifier",
                          value: "num",
                          start: 4,
                          end: 7,
                          is_error: false,
                          children: null
                       },
                       {
                          kind: "=",
                          value: "=",
                          start: 8,
                          end: 9,
                          is_error: false,
                          children: null
                       },
                       {
                          kind: "decimal_integer_literal",
                          value: "1",
                          start: 10,
                          end: 11,
                          is_error: false,
                          children: null
                       }
                    ]
                 },
                 {
                    kind: ";",
                    value: ";",
                    start: 11,
                    end: 12,
                    is_error: false,
                    children: null
                 }
              ]
           }
        ]
     }
    })
  })
})