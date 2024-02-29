import {Elysia} from 'elysia';

interface NewDog {
  name: string;
  breed: string;
}

interface Dog extends NewDog {
  id: number;
}

let lastId = 0;

// The dogs are maintained in memory.
const dogMap: {[id: number]: Dog} = {};

function addDog(name: string, breed: string): Dog {
  const id = ++lastId;
  const dog = {id, name, breed};
  dogMap[id] = dog;
  return dog;
}

addDog('Comet', 'Whippet');
addDog('Oscar', 'German Shorthaired Pointer');

interface Set {
  status: number;
}
function notFound(set: Set) {
  set.status = 404;
  return 'Not Found';
}

function group(app: Elysia): Elysia {
  // This gets all the dogs as either JSON or HTML.
  app.get('/', ({headers}) => {
    const accept = headers.accept;
    if (accept && accept.includes('application/json')) {
      return dogMap;
    }

    const dogs = Object.values(dogMap).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    const title = 'Dogs I Know';
    return (
      <html>
        <head>
          <link rel="stylesheet" href="public/styles.css" />
          <title>{title}</title>
        </head>
        <body>
          <h1>{title}</h1>
          <ul>
            {dogs.map((dog: Dog) => (
              <li>
                {dog.name} is a {dog.breed}.
              </li>
            ))}
          </ul>
        </body>
      </html>
    );
  });

  // This gets one dog by its id as JSON.
  app.get('/:id', ({params, set}) => {
    const id = Number(params.id);
    const dog = dogMap[id];
    return dog ? dog : notFound(set as Set);
  });

  // This creates a new dog.
  app.post('/', async ({body, set}) => {
    const data = body as NewDog;
    const dog = addDog(data.name, data.breed);
    set.status = 201; // Created
    return dog;
  });

  // This updates the dog with a given id.
  app.put('/:id', async ({body, params, set}) => {
    const id = Number(params.id);
    const data = body as NewDog;
    const dog = dogMap[id];
    if (!dog) return notFound(set as Set);
    dog.name = data.name;
    dog.breed = data.breed;
    return dog;
  });

  // This deletes the dog with a given id.
  app.delete('/:id', async ({params, set}) => {
    const id = Number(params.id);
    const dog = dogMap[id];
    if (!dog) return notFound(set as Set);
    delete dogMap[id];
    return '';
  });

  return app;
}

export default group;
