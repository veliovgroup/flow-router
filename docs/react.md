### React + react-mounter

Use flow router with beloved `React` library. For more info read docs of [`react-mounter`](https://github.com/kadirahq/react-mounter).

```jsx
import React          from 'react'
import { mount }      from 'react-mounter';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import AboutMe from './AboutMe'; // <-- template to render

const MainLayout = ({content}) => (
    <div>
      <header>
        This is our header
      </header>
      <main>
        {content()}
      </main>
    </div>
);

FlowRouter.route('/about-me', {
  name: 'about-me',
  action() {
    mount(MainLayout, {
      content: () => <AboutMe/>,
    });
  },
});
```
