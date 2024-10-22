export interface Templates {
  title: string
  description: string
  path: string
  sub: any[]
}

export const templates: Templates[] = [
  {
    title: 'Authentication',
    description:
      'Contains forms for login, registration, password recovery, and related authentication processes.',
    path: '/templates/authentication',
    sub: [
      {
        title: 'Login',
        path: '/templates/authentication/login',
        description: 'Login template',
      },
      {
        title: 'Register',
        path: '/templates/authentication/register',
        description: 'Register template',
      },
      {
        title: 'Forgot Password',
        path: '/templates/authentication/forgot-password',
        description: 'Login template',
      },
      {
        title: 'Reset Password',
        path: '/templates/authentication/reset-password',
        description: 'Login template',
      },
    ],
  },
  {
    title: 'Contact',
    description:
      'Includes contact forms for user inquiries, feedback, and general communication.',
    path: '/templates/contact',
    sub: [
      {
        title: 'Contact',
        path: '/templates/contact/contact',
        description: 'Contact form template',
      },
      // {
      //   title: 'register',
      //   path: '/templates/contact/register',
      //   description: 'Register template',
      // },
      // {
      //   title: 'forget-password',
      //   path: '/templates/contact/forget-password',
      //   description: 'Login template',
      // },
      // {
      //   title: 'reset-password',
      //   path: '/templates/contact/reset-password',
      //   description: 'Login template',
      // },
    ],
  },
  // {
  //   title: 'Profile Management',
  //   description:
  //     'Includes a variety of forms designed for user profile updates, account settings, password changes, and personal data management.',
  //   path: '/templates/profile-management',
  //   sub: [
  //     {
  //       title: 'login',
  //       path: '/templates/profile-management/login',
  //       description: 'Login template',
  //       img: DemoImage,
  //     },
  //     {
  //       title: 'register',
  //       path: '/templates/profile-management/register',
  //       description: 'Register template',
  //       img: DemoImage,
  //     },
  //     {
  //       title: 'forget-password',
  //       path: '/templates/profile-management/forget-password',
  //       description: 'Login template',
  //       img: DemoImage,
  //     },
  //     {
  //       title: 'reset-password',
  //       path: '/templates/profile-management/reset-password',
  //       description: 'Login template',
  //       img: DemoImage,
  //     },
  //   ],
  // },
]
