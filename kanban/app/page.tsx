"use client";

import React, { useEffect, useState, useMemo } from "react";
import { FiPlus, FiTrash } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaFire } from "react-icons/fa";
import "./globals.css";

const Kanban = () => {
  return (
    <div className="h-screen w-full bg-neutral-900 text-neutral-50">
      <Board />
    </div>
  );
};

type Card = {
  title: string;
  id: string;
  column: string;
};

const Board = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [hasChecked, setHasChecked] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    if (hasChecked) {
      localStorage.setItem("kanban", JSON.stringify(cards));
    }
  }, [cards, hasChecked]);

  useEffect(() => {
    const cardData = localStorage.getItem("kanban");
    setCards(cardData ? JSON.parse(cardData) : DEFAULT_TASKS);
    setHasChecked(true);
  }, []);

  useEffect(() => {
    if (hasChecked) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 350); // i feel like it looks bad if its too fast so i added a delay
      return () => clearTimeout(timer);
    }
  }, [hasChecked]);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-neutral-900">
        <span className="text-neutral-400">Loading...</span>{" "}
      </div>
    );
  }

  return (
    <div className="h-full w-full flex items-center justify-center bg-neutral-900">
      <div className="flex gap-3 p-12 overflow-x-scroll no-scrollbar">
        <Column
          title="Backlog"
          column="backlog"
          headingColor="text-neutral-400"
          cards={cards}
          setCards={setCards}
        />
        <Column
          title="To-Do"
          column="todo"
          headingColor="text-yellow-200"
          cards={cards}
          setCards={setCards}
        />
        <Column
          title="Doing"
          column="doing"
          headingColor="text-blue-400"
          cards={cards}
          setCards={setCards}
        />
        <Column
          title="Done"
          column="done"
          headingColor="text-green-400"
          cards={cards}
          setCards={setCards}
        />
        <BurnBarrel setCards={setCards} />
      </div>
    </div>
  );
};

type ColumnProps = {
  title: string;
  headingColor: string;
  cards: Card[];
  column: string;
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
};

const Column = ({
  title,
  headingColor,
  cards,
  column,
  setCards,
}: ColumnProps) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, card: Card) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  type DragEndEvent = React.DragEvent<HTMLDivElement>;

  const handleDragEnd = (e: DragEndEvent) => {
    const cardId = e.dataTransfer.getData("cardId");

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = (element as HTMLElement).dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];

      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, column };

      copy = copy.filter((c) => c.id !== cardId);

      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      setCards(copy);
    }
  };

  type DragEvent = React.DragEvent<HTMLDivElement>;

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);

    setActive(true);
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();

    indicators.forEach((i) => {
      (i as HTMLElement).style.opacity = "0";
    });
  };

  const highlightIndicator = (e: React.DragEvent<HTMLDivElement>) => {
    const indicators: Element[] = getIndicators();

    clearHighlights(indicators as HTMLElement[]);

    const el = getNearestIndicator(e, indicators);

    (el.element as HTMLElement).style.opacity = "1";
  };

  type NearestIndicator = {
    offset: number;
    element: Element;
  };

  const getNearestIndicator = (
    e: React.DragEvent<HTMLDivElement>,
    indicators: Element[]
  ): NearestIndicator => {
    const DISTANCE_OFFSET = 50;

    const el: NearestIndicator = indicators.reduce(
      (closest: NearestIndicator, child: Element) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = (): HTMLElement[] => {
    return Array.from(
      document.querySelectorAll(`[data-column="${column}"]`)
    ) as HTMLElement[];
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const filteredCards = useMemo(
    () => cards.filter((c) => c.column === column),
    [cards, column]
  );

  return (
    <div className="w-64 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-large ${headingColor}`}>{title}</h3>
        <span className="rounded text-md text-neutral-400">
          {filteredCards.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${
          active ? "bg-neutral-800/50" : "bg-neutral-800/0"
        }`}
      >
        {filteredCards.map((c) => {
          return <Card key={c.id} {...c} handleDragStart={handleDragStart} />;
        })}
        <DropIndicator beforeId={null} column={column} />
        <AddCard column={column} setCards={setCards} />
      </div>
    </div>
  );
};

type CardProps = {
  title: string;
  id: string;
  column: string;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, card: Card) => void;
};

const Card = ({ title, id, column, handleDragStart }: CardProps) => {
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        /* eslint-disable @typescript-eslint/no-explicit-any */
        onDragStart={(e: any) => handleDragStart(e, { title, id, column })}
        /* eslint-enable @typescript-eslint/no-explicit-any */
        className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
      >
        <p className="text-md text-neutral-100">{title}</p>
      </motion.div>
    </>
  );
};

type DropIndicatorProps = {
  beforeId: string | null;
  column: string;
};

const DropIndicator = ({ beforeId, column }: DropIndicatorProps) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};

type BurnBarrelProps = {
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
};

const BurnBarrel = ({ setCards }: BurnBarrelProps) => {
  const [active, setActive] = useState(false);

  type DragEvent = React.DragEvent<HTMLDivElement>;

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    const cardId = e.dataTransfer.getData("cardId");

    setCards((pv) => pv.filter((c) => c.id !== cardId));

    setActive(false);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`ml-12 mt-10 grid w-64 h-64 shrink-0 place-content-center rounded border text-3xl ${
        active
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-700 bg-neutral-800/20 text-neutral-700"
      }`}
    >
      {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
    </div>
  );
};

const AddCard = ({
  column,
  setCards,
}: {
  column: string;
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
}) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!text.trim().length) return;

    const newCard: Card = {
      column,
      title: text.trim(),
      id: Math.random().toString(),
    };

    setCards((pv) => [...pv, newCard]);

    setAdding(false);
  };

  return (
    <>
      {adding ? (
        <motion.form layout onSubmit={handleSubmit}>
          <textarea
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder="Add new task..."
            className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
          />
          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <button
              onClick={() => setAdding(false)}
              className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
            >
              <span>Add</span>
              <FiPlus />
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
        >
          <span>Add task</span>
          <FiPlus />
        </motion.button>
      )}
    </>
  );
};

const DEFAULT_TASKS = [
  // BACKLOG
  // { title: "Look into render bug in dashboard", id: "1", column: "backlog" },
  // { title: "SOX compliance checklist", id: "2", column: "backlog" },
  // { title: "[SPIKE] Migrate to Azure", id: "3", column: "backlog" },
  // { title: "Document Notifications service", id: "4", column: "backlog" },
  // TODO
  // {
  //   title: "Research DB options for new microservice",
  //   id: "5",
  //   column: "todo",
  // },
  // { title: "Postmortem for outage", id: "6", column: "todo" },
  // { title: "Sync with product on Q3 roadmap", id: "7", column: "todo" },
  // DOING
  // {
  //   title: "Refactor context providers to use Zustand",
  //   id: "8",
  //   column: "doing",
  // },
  // { title: "Add logging to daily CRON", id: "9", column: "doing" },
  // DONE
  // {
  //   title: "Set up DD dashboards for Lambda listener",
  //   id: "10",
  //   column: "done",
  // },
];

export default Kanban;
