// Welcome to the collaborative editor!
// This file is loaded from the server workspace

interface User {
  id: string;
  name: string;
  email: string;
}

function greetUser(user: User): string {
  return `Hello, ${user.name}! Welcome to the collaborative editor.`;
}

const currentUser: User = {
  id: '1',
  name: 'Developer',
  email: 'dev@example.com'
};

console.log(greetUser(currentUser));

// TODO: Add your collaborative editing logic here
export { User, greetUser }; 