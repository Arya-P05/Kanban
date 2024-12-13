import React from "react";

const Kanban = () => {
  return (
    <div className="h-screen w-full bg-neutral-900 text-neutral-50">
      <Board />
    </div>
  );
};

const Board = () => {
  return <div className="flex h-full w-full gap-3 overflow-scroll p-12"></div>;
};

export default Kanban;
