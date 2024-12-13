# Kanban Board

This is an interactive Kanban board built with React, TypeScript, and Framer Motion. Users can create, manage, and organize tasks across columns using drag-and-drop functionality with visual feedback.

## Features

- **Drag-and-Drop**: Move tasks between columns.
- **Task Management**: Add, delete, and rearrange tasks.
- **Burn Barrel**: Drag tasks here to delete them.
- **Customizable Columns**: Modify and add columns.
- **Visual Feedback**: Highlights drop targets and transitions.
- **Mobile-Friendly**: Optimized for small screens.

## Technologies

- **React**: UI components.
- **TypeScript**: Strong typing.
- **Framer Motion**: Smooth animations.
- **React Icons**: UI icons.
- **Tailwind CSS**: Modern styling.

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/kanban-board.git
   cd kanban-board
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Start the server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. Open:
   ```
   http://localhost:3000
   ```

## Key Components

- `Kanban.tsx`: Main board component.
- `Board`: Manages columns and state.
- `Column`: Displays tasks.
- `Card`: Task component.
- `BurnBarrel`: Deletes tasks.
- `AddCard`: Adds new tasks.

## Usage

1. **Add Tasks**: Click "Add team," enter a title, and click "Add."
2. **Move Tasks**: Drag between or within columns.
3. **Delete Tasks**: Drag tasks to the "Burn Barrel."

## Customization

- **Default Tasks**: Update the `DEFAULT_TEAMS` array.
- **Styling**: Edit Tailwind CSS classes.
- **Columns**: Add columns in `Board`.

## Future Plans

- **Save Tasks**: Use local storage or a database. (currently working on making it persist on relaods!!)
- **User Accounts**: Support multiple users.
- **Custom Columns**: Allow creation and renaming.
- **Enhanced Animations**: Add advanced effects.

## License

Open-source.

---

For any questions or suggestions, feel free to create an issue in the repository.
