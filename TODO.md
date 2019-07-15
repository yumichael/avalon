There are other TODOs scattered within the code itself. Use VSCode and search `TODO`.

# TODO right now

- Give room directorship.
- Walls closing in and banner/command borders colors.
  - Banner becomes winning team color at game finish.
  - Command is room passive color when there is no active game.
  - Walls closing in are black, but the inner border is tint of the "winning" team color.
- New game and game help button.
- Add people count on mission stamp.

# TODO features

- Add cool down for host updating data autorun.
- x Skip voting for final round of a mission.
- x Add player faction to `I am player ${k}` part.
- x Un-strong the mission outcome text.
- Add delay to switch to next round on round finish.
- Add hiding bid buttons.
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
- Delete previous game on starting new game.

# TODO UI unpleasantries

- Dismiss chat keyboard on swipe down.
- v Why does chat view change width a few pixels as messages stretch the boundary?
- Let chat input keyboard Enter key be "Return" when there is no input and "Send" when there is.
- Prevent chat scrolling with new messages when viewing old messages.

# TODO dot i and cross t

- Make sure all deps are accounted for in all hooks.
- Mind the usage of `useCallback` vs `useEventCallback`.
- Mind the usage of `useMemo` vs `useHardMemo`.
