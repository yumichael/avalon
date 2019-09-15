There are other TODOs scattered within the code itself. Use VSCode and search `TODO`.

# TODO right now

- v Refactor `RoomX` UI states into a MobX observable class and similarly for `GameXInsert`.
  - x? Let the`RoomX`state class hold a copy of the`GameXInsert` state class.
- v View roles.
- Give room directorship to another player feature.
- ? Walls closing in and banner/command borders colors.
  - v Banner becomes winning team color at game finish.
  - Command is room passive color when there is no active game.
  - Walls closing in are black, but the inner border is tint of the "winning" team color.
- v New game and game help button.
- Add people count on mission stamp.

# TODO features

- Add cool down for host updating data autorun.
- v Skip voting for final round of a mission.
- x Add player faction to `I am player ${k}` part.
- x Un-strong the mission outcome text.
- x Add delay to switch to next round on round finish.
- x Add hiding bid buttons.
- Long press role stack chip for modal info.

# TODO code design

- Solving the firestorter Doc ready-not-ready problem options:
  1. Ignore and see if problem persists on mobile.
  - See if the problem is actually inconsequential on a production build?
    (It's ok to try to access `undefined.whatever` because the component doing that will be trashed soon.)
  - See if problem persists even after adding artificial delay...?
  2. Add code in all API classes to handle not-ready problems gracefully.
  3. Let UI components defer as late as possible getting information so only `<Model>Api.Initiator` is trickled down.
- Does the length-2 array returned by `useState` maintain shallow comparison identity when state is not changed? (c.f. `RoomXState`)
- v Delete previous game on starting new game.
- Add timestamp to game start and room start.
- Mind double clicking things (e.g. doubled Start New Game makes zombie Game Doc in Firebase (fixed now by changing UI state on start new game))

# TODO UI unpleasantries

- Dismiss chat keyboard on swipe down.
- v Why does chat view change width a few pixels as messages stretch the boundary?
- Let chat input keyboard Enter key be "Return" when there is no input and "Send" when there is.
- Prevent chat scrolling with new messages when viewing old messages.
- Make text only command buttons not span entire command width.

# TODO dot i and cross t

- Make sure all deps are accounted for in all hooks.
- Mind the usage of `useCallback` vs `useEventCallback`.
- Mind the usage of `useMemo` vs `useHardMemo`.
- Search for `.update(` and `.set(` and make sure code coupling (in NoSQL data naming) is kept either explicit or local.
