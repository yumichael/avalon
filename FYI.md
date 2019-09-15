- What are the naming and code hierarchy organization (under folders or layers of namespaces) conventions?

  - What are the naming conventions
    - For files, PascalCase is used when a file is best summarized by a Proper Noun whose domain is specific to this app and camelCase is used for a file that is best summarized by a general term whose meaning is retained outside the context of this app.
      - As a corollary, PascalCase is used for React component containing .tsx files.
    - Folders are named as parsimoniously as possible as long as its responsibility is fully specified given the ancestral folder context.
    - Files are named succinctly but need to maintain global intention unambiguity.
    - Single default export items must match their file name (before the file extension), except React components.
    - React component names must be the default export and match their file name with an extra "X" at the end.
  - What is the convention for default export vs named exports? - A file can have one default export and no named exports. - In the code, define the exported item without `export`, and `export default <item>` at the bottom. - VSCode refactoring can smartly rename imported default items, so that is a non-issue. - A file can have only named exports and no default exports.

  ###### @ src/models/\w+

  - What is the code structure of folders under `src/models`? - Each folder under `src/model` encapsulates one Model. - A Model corresponds to a document in a particular collection of Firebase documents. - There is a `.ts` file named with just the Model name. - It has the data model type definitions as a namespace. - The `.Data` type is the actual data that is put in the Firebase document. - It has Firebase/firestorter API wrappers. - Types coupled with the data model are highly hierarchically named under the top namespace. - The hierarchy naming choices are aimed toward "minimizing cognitive overhead", whatever that means - There is a `.ts` file named with the Model name plus "Api". - It encapsulates handling the database connection and data model behind the Model. - Its name containing "Api" reflects that it fills the same role as API calls to a server (we have no server code because we use a BaaS in Firebase). - The other files named by Model name plus something else should only be accessed via the `<Model>Api` class. - Their construction sometimes have a precondition on the data at the document.

  ###### @ src/components

  - What are the files under `src/components` that are not .tsx files?
    - Only UI logic, i.e. information that is local to the client, are saved under `src/components`

- What part of the code takes responsibility of specific live concepts that exist when the app is functional?

  - How are Firebase handles passed between different code entities?
    - `DocumentReference` is used whenever possible.
    - The ID of the document is used instead of for example it is needed as a key to a map.
  - What keeps the synced Firebase document data and interacts with Firebase's API?
    - The external `firestorter` is used for all Firebase document interactions.
    - Firestorter is wrapped by entirely by `src/library/Database` in internal use.
    - Models that need a `firestore.Document` handle all use the wrapped class `src/library/abstractions/DocApi`.
      - `DocApi` exists because only `DocumentReference`s are passed around, not references to the class with data.
      - `DocApi` fills the role that a `WeakMap` taking `DocumentReference` to `firestorter.Document` would fill.
  - What owns interactions with the database?
    - All application interaction should be abstracted by each Model's API class.
    - UI components should only interact with application logic using the Model API classes.
  - What should initiate a Model's API?
    - The top component for a Model should prefer taking a `DocumentReference` to the Model as a prop and initiating the Model API itself.
    - However, for example in `RoomX` |owns> `RoomPlayingX` |owns> `GameXInsert`, there is already a buffer entity RoomPlaying between the Game Model's components and its owning Model, Room, so it ends up being simpler for RoomPlaying to initiate and own Game's API.
  - In general, when an entity is actually a "maybe" version of its "just" self, should the canonical handler (by handler I mean e.g. how a single React component handles the UI for one Model) for it take as argument the "maybe" version or the "just" version?
    - Prefer taking as argument the "maybe" version.
    ###### @ src/components/game/players/\w+Decorator.tsx
    - For one example, look at the `<PlayerAttribute>Decorator` components. - Even if a decorator should not render, it is much easier to have the component itself decide that instead of the component above deciding to maybe or maybe not include it in its component tree.
    ###### @ src /components/game/GameXInsert.tsx
    - However, despite `GameXInsert` being the canonical UI class for the Game Model, it takes in "just" `GameApi`.
      - `GameXInsert` is quite special because its UI pieces need to be individually embedded by its owner.

- What are the product design choices?

  ###### Room

  - What are the Room design choices?
    - Sitting down when game start is attempted means you will be part a player in the game.

  ###### Game

  - What are the Game design choices?
    - For the last voting round of a mission the vote passes automatically instead of the official Resistance rule.

- What are the software design choices?

  - For user-to-user application data, Firestore documents are the single point of truth.
  - Maps are highly favored over arrays in Firestore documents.

  ###### Game

  - What are the Game design choices?
    - Missions and round data, keyed by their index, are only pushed into their containers when they become in play.
    - One player also functions as Host and updates the Game document when no player naturally should own the update.

- What concept does a proper noun name specifically refer to?

  ###### Game

  - A game of The Resistance or its variant, in the abstract form where players are just identified by an index.
    ###### Informer
    - Convert raw Firebase synced data to useable form.
    ###### Actor
    - Let the user interact with the game.
    ###### Host
    - Provide autorun functions that add necessary data to Firebase (one player is host per game).

  ###### User

  - An external agent who interacts with the app.
    - For now they are all just people who use the app.

  ###### Room

  - An entity that collects a group of users together so they can play a game with each other.
    ###### Director
    - The user who probably started the room and who is the default person to be priviledged with doing something.
    ###### Playing
    - The Room-Game connecting API
      - The `.playing` property on `RoomApi` is uniquely tied to the Game ref.
