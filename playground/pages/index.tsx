import Head from 'next/head';
import { useState, Fragment } from 'react';
import axios from 'axios';
import { Disclosure } from '@headlessui/react';
import { prettyPrintJson } from 'pretty-print-json';
import {
  CollectionIcon,
  DocumentTextIcon,
} from '@heroicons/react/solid';
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import Editor from "react-simple-code-editor";
import { highlight, languages, Grammar } from "prismjs";
import "prismjs/themes/prism.css";
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-dart';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';

const BACKEND_ENDPOINT = process.env.NODE_ENV === 'production' ? 'https://api.mintlify.com' : 'http://localhost:5000';

const ADMIN_ACCESS_KEY = 'K29JrZ2qr3VuHgYc';

type LanguageOption = {
  name: string;
  grammar: Grammar;
  filename: string;
  languageId: string;
}

type Mode = 'ast' | 'synopsis';

// https://lucidar.me/en/web-dev/list-of-supported-languages-by-prism/
const languageOptions: LanguageOption[] = [
  { name: 'JavaScript', grammar: languages.javascript, filename: 'index.js', languageId: 'javascript' },
  { name: 'TypeScript', grammar: languages.typescript, filename: 'index.ts', languageId: 'typescript' },
  { name: 'Python', grammar: languages.python, filename: 'script.py', languageId: 'python' },
  { name: 'PHP', grammar: languages.python, filename: 'index.php', languageId: 'php' },
  { name: 'React JSX', grammar: languages.jsx, filename: 'App.jsx', languageId: 'javascriptreact' },
  { name: 'React TSX', grammar: languages.tsx, filename: 'App.tsx', languageId: 'typescriptreact' },
  { name: 'Ruby', grammar: languages.ruby, filename: 'script.rb', languageId: 'ruby' },
  { name: 'Rust', grammar: languages.rust, filename: 'script.rs', languageId: 'rust' },
  { name: 'Java', grammar: languages.java, filename: 'home.java', languageId: 'java' },
  { name: 'Kotlin', grammar: languages.kotlin, filename: 'AppService.kt', languageId: 'kotlin' },
  { name: 'C', grammar: languages.c, filename: 'script.c', languageId: 'c' },
  { name: 'C++', grammar: languages.cpp, filename: 'script.cpp', languageId: 'cpp' },
  { name: 'C#', grammar: languages.csharp, filename: 'script.cs', languageId: 'csharp' },
  { name: 'Dart', grammar: languages.dart, filename: 'script.dart', languageId: 'dart' },
  { name: 'Go', grammar: languages.go, filename: 'script.go', languageId: 'go'}
];

const classNames = (...classes: any) => {
  return classes.filter(Boolean).join(' ');
}

const hightlightWithLineNumbers = (input: string, grammar: Grammar, language: string, lineIncrement = 0) =>
  highlight(input, grammar, language)
    .split("\n")
    .map((line, i) => `<span class='editorLineNumber'>${i + 1 + lineIncrement}</span>${line}`)
    .join("\n");

export default function Playground() {
  const [code, setCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0]);
  const [mode, setMode] = useState<Mode>('ast');
  const [ast, setAst] = useState({});
  const [synopsis, setSynopsis] = useState({});
  const [timeToGenerate, setTimeToGenerate] = useState<number>(0);

  const updateMints = async (code: string, language: LanguageOption, modeOverride = mode, file = code): Promise<void> => {
    const start = Date.now();
    const mintsResponse: { data: { ast?: string, synopsis?: string, docstring?: string } } = await axios.post(
      `${BACKEND_ENDPOINT}/playground/mints/${modeOverride}`,
    {
      code,
      languageId: language.languageId,
      context: file,
      accessKey: ADMIN_ACCESS_KEY
    });

    const end = Date.now();
    if (mintsResponse.data.ast != null) {
      setAst(mintsResponse.data.ast);
    } else if (mintsResponse.data.synopsis != null) {
      setSynopsis(mintsResponse.data.synopsis);
    }

    setTimeToGenerate(end - start);
  }

  const handleMouseMove = () => {
    const selection = window.getSelection()?.toString();
    if (selection) {
      updateMints(selection, selectedLanguage, mode, code)
    }
  }

  const onCodeChange = async (code: string) => {
    setCode(code);
    await updateMints(code, selectedLanguage);
  }

  const onChangeLanguage = async (language: LanguageOption) => {
    setSelectedLanguage(language);
    await updateMints(code, language);
  }

  const onChangeMode = async (mode: Mode) => {
    setMode(mode);
    setAst({});
    setSynopsis({});
    setTimeToGenerate(0);

    await updateMints(code, selectedLanguage, mode);
  }
  
  return (
    <>
      <Head>
        <title>Playground</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pretty-print-json@1.1/dist/pretty-print-json.css" />
      </Head>
      {/* Background color split screen for large screens */}
      <div className="fixed top-0 left-0 w-1/2 h-full bg-white" aria-hidden="true" />
      <div className="fixed top-0 right-0 w-1/2 h-full" aria-hidden="true" />
      <div className="relative min-h-full flex flex-col">
        {/* Navbar */}
        <Disclosure as="nav" className="flex-shrink-0 bg-primary">
          <>
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
              <div className="relative flex items-center justify-between h-16">
                {/* Logo section */}
                <div className="flex items-center px-2 lg:px-0 xl:w-64">
                  <div className="flex-shrink-0">
                    <svg className="h-8" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 581.38 581.37">
                      <path d="M715.94,134.71H499.36a215.07,215.07,0,0,0-148.17,58.62l-.09-.09-4.92,4.93h0L199.44,344.91l-.75.76c-.25.23-.48.47-.72.71q-1.08,1.08-2.13,2.16l-2.68,2.7.05.05a216.45,216.45,0,0,0-15.55,278l6.23,8.3L345,476.44l-4.69-6.25a197.83,197.83,0,0,1-39.5-120.93v0a198.3,198.3,0,0,1,5.16-43.1,199.56,199.56,0,0,1,111.87,6.32,196.5,196.5,0,0,1,52.19,28,200.89,200.89,0,0,1,40.14,40.14,199,199,0,0,1,34.32,164,198.29,198.29,0,0,1-164-34.32l-6.25-4.69L213.09,666.76,221.4,673a215.62,215.62,0,0,0,129.42,43.09h2.52a215.2,215.2,0,0,0,145.94-58.59l.08.08,4.89-4.89.31-.31L651,505.89l1.2-1.21.27-.26.65-.66,4.34-4.38-.06-.06a215,215,0,0,0,58.5-148Zm-394.61,340L186,610A198.72,198.72,0,0,1,210.7,359.11c.37-.38.75-.77,1.15-1.12l7-6.31-.33-.34,79.28-79.29c-.32.82-.62,1.65-.93,2.47s-.66,1.74-1,2.62c-.47,1.29-.91,2.58-1.36,3.88-.28.83-.58,1.65-.85,2.48-.47,1.43-.91,2.87-1.35,4.31-.22.71-.45,1.42-.66,2.13q-.92,3.1-1.74,6.24l-.06.25L286,311.28l.6-.16a216.27,216.27,0,0,0,34.78,163.54Zm178,157.44-.37-.36-6.35,7c-.35.39-.74.77-1.12,1.15a198.43,198.43,0,0,1-250.83,24.68L376,529.32a215.84,215.84,0,0,0,125.59,38.5,216.39,216.39,0,0,0,37.92-3.73l-.15.59,14.85-3.87c2.17-.56,4.34-1.17,6.49-1.8.73-.21,1.45-.45,2.18-.67,1.42-.44,2.83-.87,4.24-1.33l2.58-.89c1.26-.43,2.52-.86,3.78-1.32l2.7-1,2.41-.91ZM697.92,351.28a197.13,197.13,0,0,1-57.61,139.85l-2,1.95c-1.44,1.42-2.91,2.8-4.39,4.17l-1.46,1.32c-1,.91-2,1.83-3.06,2.72l-1.75,1.49q-1.44,1.23-2.91,2.43l-1.85,1.49c-1,.79-2,1.56-3,2.33-.61.47-1.21.93-1.82,1.38-1.1.83-2.23,1.64-3.35,2.45l-1.53,1.1q-2.46,1.72-5,3.37l-.61.39c-1.47,1-3,1.91-4.47,2.83-.58.36-1.17.7-1.76,1.06-1.13.68-2.28,1.36-3.43,2l-2,1.13q-1.65.91-3.3,1.8l-2.08,1.1c-1.13.59-2.27,1.16-3.42,1.72l-2,1c-1.3.62-2.61,1.23-3.93,1.82l-1.53.71c-1.84.81-3.68,1.6-5.54,2.35-.3.13-.61.24-.91.36q-2.34.95-4.7,1.82c-.63.24-1.27.46-1.9.68-.87.32-1.75.62-2.63.93a216.22,216.22,0,0,0-39.5-169.21,218.2,218.2,0,0,0-43.73-43.74A215.8,215.8,0,0,0,351.32,283l-2.42,0a215.29,215.29,0,0,0-37.3,3.59c.3-.87.6-1.73.91-2.59.24-.65.46-1.31.71-2,.57-1.54,1.17-3.08,1.78-4.6l.39-1q1.14-2.78,2.35-5.52l.73-1.59c.59-1.3,1.18-2.59,1.8-3.87.32-.67.65-1.34,1-2,.57-1.14,1.14-2.28,1.72-3.41l1.1-2.08c.59-1.1,1.19-2.21,1.8-3.3l1.13-2c.66-1.16,1.35-2.3,2-3.45.35-.58.69-1.16,1.05-1.74.93-1.52,1.89-3,2.87-4.54.12-.17.23-.35.34-.53,1.11-1.68,2.24-3.33,3.39-5,.35-.5.71-1,1.07-1.49.82-1.14,1.64-2.27,2.47-3.39l1.36-1.79c.78-1,1.56-2,2.36-3l1.47-1.82c.81-1,1.62-2,2.45-2.94l1.47-1.73c.91-1,1.83-2.07,2.76-3.1l1.28-1.42q2.06-2.22,4.18-4.4l1.66-1.7a197.28,197.28,0,0,1,140.15-57.89H697.94Z" transform="translate(-134.55 -134.71)" fill="#fff"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </>
        </Disclosure>

        {/* 3 column wrapper */}
        <div className="flex-grow w-full max-w-7xl mx-auto xl:px-8 lg:flex">
          {/* Left sidebar & main wrapper */}
          <div className="flex-1 min-w-0 bg-white xl:flex">
            {/* Account profile */}
            <div className="xl:min-h-screen lg:flex-1 xl:flex-shrink-0 xl:border-r xl:border-gray-200 bg-white max-w-3xl">
              <div className="pl-4 pr-6 pt-4 pb-4 sm:pl-6 lg:pl-8 xl:pl-6 xl:pt-6 xl:border-t-0 h-full">
                <div className="flex">
              <Listbox value={selectedLanguage} onChange={(language) => onChangeLanguage(language)}>
                {({ open }) => (
                  <>
                    <div className="relative flex-1">
                      <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm">
                        <span className="block truncate">{selectedLanguage.name}</span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                      </Listbox.Button>

                      <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                          {languageOptions.map((language) => (
                            <Listbox.Option
                              key={language.name}
                              className={({ active }) =>
                                classNames(
                                  active ? 'text-white bg-primary' : 'text-gray-900',
                                  'cursor-default select-none relative py-2 pl-8 pr-4'
                                )
                              }
                              value={language}
                            >
                              {({ selected, active }) => (
                                <>
                                  <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                    {language.name}
                                  </span>

                                  {selected ? (
                                    <span
                                      className={classNames(
                                        active ? 'text-white' : 'text-primary',
                                        'absolute inset-y-0 left-0 flex items-center pl-1.5'
                                      )}
                                    >
                                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
              </div>
                <div className="flex items-center justify-between h-full">
                  <div className="relative flex-1 space-y-8 h-full" onMouseUp={handleMouseMove} onMouseDown={handleMouseMove}>
                  <Editor
                    value={code}
                    onValueChange={(code) => onCodeChange(code)}
                    placeholder="Insert code here"
                    highlight={(code) => hightlightWithLineNumbers(code, selectedLanguage.grammar, selectedLanguage.name)}
                    padding={10}
                    textareaId="codeArea"
                    className="editor mt-2 h-full"
                    style={{
                      fontFamily: 'monospace',
                    }}
                  />
                  </div>
                </div>
              </div>
            </div>

            {/* Projects List */}
            <div className="bg-white lg:min-w-0 lg:flex-1">
              <div className="pl-4 pr-6 pt-4 pb-4 border-b border-t border-gray-200 sm:pl-6 lg:pl-8 xl:pl-6 xl:pt-6 xl:border-t-0">
                {/* Search section */}
                <div className="flex-1 flex justify-center lg:justify-end">
                <span className="w-full relative z-0 flex">
                  <button
                    type="button"
                    className={classNames("flex-1 -ml-px relative inline-flex rounded-l-md justify-center items-center px-4 py-2 border text-sm font-medium focus:z-10 focus:outline-none focus:border-primary", mode === 'ast' ? 'border-gray-300 bg-primary text-gray-50' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50')}
                    onClick={() => onChangeMode('ast')}
                  >
                    <CollectionIcon className="w-4 h-4 mr-1" />
                    Create AST
                  </button>
                  <button
                    type="button"
                    className={classNames("flex-1 -ml-px relative inline-flex rounded-r-md justify-center items-center px-4 py-2 border text-sm font-medium focus:z-10 focus:outline-none focus:border-primary", mode === 'synopsis' ? 'border-gray-300 bg-primary text-gray-50' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50')}
                    onClick={() => onChangeMode('synopsis')}
                  >
                    <DocumentTextIcon className="w-4 h-4 mr-1" />
                    Get Synopsis
                  </button>
                </span>
                </div>
                <div className="mt-4 flex items-center">
                  { mode === 'ast' && (
                    <div className="flex-1">
                      <h1 className="text-lg font-medium">🌲 AST</h1>
                      <p className="text-sm text-gray-600">Generated in {timeToGenerate}ms</p>
                    </div>
                  )}
                  { mode === 'synopsis' && (
                    <div className="flex-1">
                      <h1 className="text-lg font-medium">📄 Synopsis</h1>
                      <p className="text-sm text-gray-600">Generated in {timeToGenerate}ms</p>
                    </div>
                  )}
                </div>
              </div>
              {
                mode === 'ast' && (
                <div className="px-4 sm:pl-6 whitespace-pre block" dangerouslySetInnerHTML={{__html: prettyPrintJson.toHtml(ast)}}>
                </div>)
              }
              {
                mode === 'synopsis' && (
                  <div className="px-4 sm:pl-6 whitespace-pre block" dangerouslySetInnerHTML={{__html: prettyPrintJson.toHtml(synopsis)}}>
                  </div>)
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}