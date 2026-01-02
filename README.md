# Form Builder
A dynamic form-building tool that allows users to create, customize, and validate forms seamlessly within web applications. Built with React, Next.js, and various other technologies, Form Builder provides an intuitive interface for developers and users alike.

<br />
<br />
<a href="https://vercel.com/oss">
  <img alt="Vercel OSS Program" src="https://vercel.com/oss/program-badge.svg" />
</a>

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
  - [Sponsors](#sponsors)
    - [⭐ Header Sponsors ($100/month)](#-header-sponsors-100month)
    - [Project Supporters ($50/month)](#project-supporters-50month)
    - [Community Supporters ($10/month)](#community-supporters-10month)
    - [Past Sponsors](#past-sponsors)
    - [Interested in Sponsoring?](#interested-in-sponsoring)
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

## Sponsors

A huge thank you to everyone who has supported this project! Your generosity keeps this project alive and growing. I truly appreciate every single one of you.

### ⭐ Header Sponsors ($100/month)

Premium sponsors featured prominently throughout the project:

<div align="center">
  <a href="https://shadcnstudio.com/?utm_source=shadcn-form&utm_medium=github&utm_campaign=sponsor">
    <img src="https://ts-assets.b-cdn.net/ss-assets/logo/logo.svg" alt="shadcnstudio.com" width="200" height="100" style="margin: 20px; border-radius: 8px;" />
  </a>
</div>

**[shadcnstudio.com](https://shadcnstudio.com/?utm_source=shadcn-form&utm_medium=github&utm_campaign=sponsor)** - Explore beautiful shadcn blocks & templates to accelerate your development.

### Project Supporters ($50/month)

These wonderful folks help drive the project forward:

- Come be the first! [Become a Project Supporter](https://github.com/sponsors/hasanharman)

### Community Supporters ($10/month)

Thank you for being part of this journey:

- Come be the first! [Become a Community Supporter](https://github.com/sponsors/hasanharman)

### Past Sponsors

A heartfelt thanks to those who previously supported the project:

| | | | | |
|:---:|:---:|:---:|:---:|:---:|
| [![tino-technology](https://avatars.githubusercontent.com/u/150597157?s=100&v=4)](https://github.com/tino-technology) | [![feliperails](https://avatars.githubusercontent.com/u/1680000?s=100&v=4)](https://github.com/feliperails) | [![Radu Ciocan](https://avatars.githubusercontent.com/u/4984377?s=100&v=4)](https://github.com/raduciocan) | [![rutsatz](https://avatars.githubusercontent.com/u/14064725?s=100&v=4)](https://github.com/rutsatz) | [![Maxim Ciebiera](https://avatars.githubusercontent.com/u/47557243?s=100&v=4)](https://github.com/maxciebiera) |
| [tino-technology](https://github.com/tino-technology) | [feliperails](https://github.com/feliperails) | [Radu Ciocan](https://github.com/raduciocan) | [rutsatz](https://github.com/rutsatz) | [Maxim Ciebiera](https://github.com/maxciebiera) |

---

### Interested in Sponsoring?

Your support helps keep this project alive and thriving! [Become a sponsor on GitHub](https://github.com/sponsors/hasanharman) and help shape the future of form building.

## Acknowledgements

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
- [Next.js](https://nextjs.org/) - The React framework for production.
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for creating custom designs.
- [Zod](https://zod.dev/) - TypeScript-first schema declaration and validation.
