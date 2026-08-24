import type { Language } from "@/types/diagnosis";

/**
 * lib/examples.ts
 * ----------------------------------------------------------------------
 * The three built-in demo examples. These only pre-fill the form —
 * clicking one never calls the AI on its own. They go through the exact
 * same POST /api/diagnose pipeline as anything a visitor types in by
 * hand, so the diagnosis is always freshly generated, never hardcoded.
 */

export interface DiagnoseExample {
  id: string;
  buttonLabel: string;
  language: Language;
  error: string;
  code: string;
  expectedBehavior: string;
}

export const EXAMPLES: DiagnoseExample[] = [
  {
    id: "python-typeerror",
    buttonLabel: "Python TypeError",
    language: "python",
    error: `TypeError: unsupported operand type(s) for +: 'int' and 'str'`,
    code: `age = input("Enter your age: ")
next_year = age + 1

print(next_year)`,
    expectedBehavior: "Print the user's age next year.",
  },
  {
    id: "javascript-undefined",
    buttonLabel: "JavaScript Undefined",
    language: "javascript",
    error: `TypeError: Cannot read properties of undefined (reading 'toUpperCase')`,
    code: `const user = {
  name: "Alex"
};

console.log(user.email.toUpperCase());`,
    expectedBehavior: "Print the user's email in uppercase.",
  },
  {
    id: "react-state-bug",
    buttonLabel: "React State Bug",
    language: "react",
    error:
      "The counter sometimes shows the wrong value when clicking the button multiple times quickly.",
    code: `const [count, setCount] = useState(0);

function increase() {
  setCount(count + 1);
  setCount(count + 1);
}`,
    expectedBehavior: "Each click should increase the counter by 2.",
  },
];
