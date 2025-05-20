# @ashish-ui/pagination

A reusable and customizable **React Pagination** component built with **TypeScript** and styled using **Tailwind CSS**. Lightweight, responsive, and perfect for modern UI design systems.

---

## Installation

```bash
npm install @ashish-ui/pagination
# or
yarn add @ashish-ui/pagination
```

## Tailwind Configuration

To ensure Tailwind picks up all class names used in the component, include the following in your `tailwind.config.js:`

```bash
content: [
  './node_modules/@ashish-ui/**/*.{js,ts,jsx,tsx}', // ✅ Add this line
  './src/**/*.{js,ts,jsx,tsx}',
],
```

## Usage

```bash
import Pagination from "@ashish-ui/pagination";

<Pagination
  currentPage={1}
  totalPages={10}
  onPageChange={(page) => console.log("Go to page:", page)}
/>
```

## Props

| Prop            | Type                   | Default                                    | Description                                 |
| --------------- | ---------------------- | ------------------------------------------ | ------------------------------------------- |
| currentPage     | number                 | —                                          | The current active page                     |
| totalPages      | number                 | —                                          | Total number of pages                       |
| onPageChange    | (page: number) => void | —                                          | Function called when a page is selected     |
| textColor       | string                 | "text-gray-200 dark:text-gray-700"         | Text color for inactive page buttons        |
| bgColor         | string                 | "bg-gray-800 dark:bg-gray-200"             | Background color for inactive page buttons  |
| activeBgColor   | string                 | "bg-blue-500"                              | Background color of the current page button |
| activeTextColor | string                 | "text-white"                               | Text color of the current page button       |
| hoverBgClass    | string                 | "hover:bg-gray-700 dark:hover:bg-gray-300" | Hover background color classes              |
| hoverTextClass  | string                 | "hover:text-white"                         | Hover text color classes                    |

## Example with Custom Styling

```bash
<Pagination
  currentPage={2}
  totalPages={5}
  onPageChange={(page) => console.log("Go to:", page)}
  textColor="text-primary"
  bgColor="bg-white"
  activeBgColor="bg-primary"
  activeTextColor="text-white"
  hoverBgClass="hover:bg-primary/80"
  hoverTextClass="hover:text-white"
/>
```

## License

ISC License © Ashish Sigdel
