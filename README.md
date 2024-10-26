# Form Builder
A dynamic form-building tool that allows users to create, customize, and validate forms seamlessly within web applications. Built with React, Next.js, and various other technologies, Form Builder provides an intuitive interface for developers and users alike.

## Table of Contents

- [Form Builder](#form-builder)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Live Demo](#live-demo)
  - [YouTube Demo](#youtube-demo)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Creating a Form](#creating-a-form)
  - [Components](#components)
  - [Validation](#validation)
  - [API](#api)
    - [Form Submission](#form-submission)
  - [Contributing](#contributing)
  - [License](#license)
  - [Acknowledgements](#acknowledgements)

## Features

- **Dynamic Form Creation**: Easily create forms with various input types including text, checkbox, radio buttons, and more.
- **Real-Time Validation**: Validate user inputs using the Zod library, ensuring data integrity and user-friendly feedback.
- **Responsive Design**: Built with Tailwind CSS, ensuring forms look great on all devices.
- **Customizable Components**: Leverage ShadCN components for a consistent and modern UI experience.
- **Server-Side Rendering**: Utilize Next.js for optimized performance and SEO.

## Live Demo

Check out the live demo of the Form Builder [here](https://www.shadcn-form.com/).

## YouTube Demo

[![Watch the demo](https://img.youtube.com/vi/25IzTkU3En4/0.jpg)](https://www.youtube.com/watch?v=25IzTkU3En4)

## Installation

To get started with Form Builder, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/hasanharman/form-builder.git
   ```

2. Navigate into the project directory:
   ```bash
   cd form-builder
   ```

3. Install the necessary dependencies:
   ```bash
   npm install
   ```

## Usage

To start the development server, run:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000` to see the application in action.

### Creating a Form

1. **Access the Builder**: Once the app is running, navigate to the form builder interface.
2. **Add Inputs**: Use the toolbar to add different types of inputs.
3. **Customize Inputs**: Click on any input field to configure properties such as label, placeholder, required validation, etc.
4. **Save & Preview**: Once your form is built, save it and preview the output.

## Components

Form Builder consists of various reusable components:

- **FormContainer**: The main container for the form elements.
- **InputField**: A customizable input component.
- **SelectField**: Dropdown selection component.
- **CheckboxField**: A checkbox input component.
- **Button**: A styled button component for form submission.

## Validation

Form Builder utilizes [Zod](https://zod.dev/) for input validation. You can define schemas for your forms as follows:

```javascript
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  age: z.number().min(18, "You must be at least 18 years old"),
});
```

This schema can be applied to your form to enforce validation rules.

## API

### Form Submission

Once your form is ready, you can handle submissions with a simple API call. Here’s an example of how to submit the form data:

```javascript
const handleSubmit = async (data) => {
  try {
    const response = await fetch('/api/form-submit', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();
    console.log('Form submitted successfully:', result);
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};
```

## Contributing

Contributions are welcome! If you would like to contribute to Form Builder, please follow these steps:

1. **Fork the Repository**: Click on the “Fork” button at the top right corner of the repository page.
2. **Create a Branch**: 
   ```bash
   git checkout -b feature/YourFeatureName
   ```
3. **Make Changes**: Implement your feature or fix.
4. **Commit Changes**: 
   ```bash
   git commit -m "Add a feature"
   ```
5. **Push Changes**: 
   ```bash
   git push origin feature/YourFeatureName
   ```
6. **Create a Pull Request**: Go to the original repository and create a pull request.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
- [Next.js](https://nextjs.org/) - The React framework for production.
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for creating custom designs.
- [Zod](https://zod.dev/) - TypeScript-first schema declaration and validation.