"use client";

import * as React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  atom,
  getDefaultStore,
  useAtom,
  useAtomValue,
  useSetAtom,
} from "jotai";
import { Command } from "@/services/commands";
import { atomWithStorage } from "jotai/utils";
import {
  cmdkOpenAtom,
  modelNameAtom,
  dialogOpenAtom,
} from "@/services/commands/atoms";
import { availableModelSchema, type AvailableModel } from "@/sharedTypes";
import { ChevronRight } from "lucide-react";
import gitChat from "@/services/gitchat/client";
import { isMcpLoadingAtom, isMcpConfigOpenAtom } from "@/services/mcp/atoms";

function setModelName(modelName: AvailableModel) {
  const store = getDefaultStore();
  store.set(modelNameAtom, modelName);
}

function setMcpConfigOpen(open: boolean) {
  const store = getDefaultStore();
  store.set(isMcpConfigOpenAtom, open);
}

function setExportDialogOpen(open: boolean) {
  const store = getDefaultStore();
  store.set(dialogOpenAtom, open);
}

function getIsLoading() {
  const store = getDefaultStore();
  return store.get(isMcpLoadingAtom);
}

const HIERARCHY_SEPARATOR = " --->>> ";

const parentIdAtom = atom<string | null>(null);
const commandTreeAtom = atomWithStorage<Command[]>("commandTree", [
  {
    name: "Set Model",
    id: "set-model",
  },
  {
    name: "MCP Config",
    id: "mcp-config",
    onSelect: () => {
      setMcpConfigOpen(true);
    },
  },
  {
    name: "Export Chat",
    id: "export-chat",
    onSelect: () => {
      if (!getIsLoading() && gitChat.commitThread.length > 0) {
        setExportDialogOpen(true);
      } else {
        alert("Please wait for the current operation to complete.");
      }
    },
  },
  {
    name: "New Thread",
    id: "new-thread",
    onSelect: () => {
      gitChat.clearCommits(true);
    },
  },
  {
    name: "Search Messages",
    id: "search-messages",
  },
  {
    name: "DELETE ALL CHATS",
    id: "delete-all-chats",
    onSelect: () => {
      gitChat.clearCommits(true);
    },
  },
  ...availableModelSchema.options.map((model) => ({
    name: model,
    id: model,
    onSelect: () => {
      setModelName(model);
    },
    parentId: "set-model",
  })),
  ...Object.values(gitChat.commits).map((commit) => ({
    name: commit.metadata.message.content,
    id: commit.id,
    onSelect: () => {
      gitChat.setCommitHead(commit.id);
    },
    parentId: "search-messages",
  })),
]);

const commandsListAtom = atom((get) => {
  const commandTree = get(commandTreeAtom);
  const parentId = get(parentIdAtom);
  const commands = commandTree
    .filter((c) => c.parentId === parentId || !parentId)
    .map((command) => {
      const parents = [];
      let node: Command | undefined = command;
      while (node?.parentId) {
        const parent = commandTree.find((c) => c.id === node?.parentId);
        parents.push(parent?.name ?? "");
        node = commandTree.find((c) => c.id === node?.parentId);
      }
      return {
        ...command,
        name:
          parents.reverse().join(HIERARCHY_SEPARATOR) +
          HIERARCHY_SEPARATOR +
          command.name,
      };
    });
  return commands;
});

export function CmdK() {
  const [inputValue, setInputValue] = React.useState("");
  const commandsList = useAtomValue(commandsListAtom);
  const setParentId = useSetAtom(parentIdAtom);
  const [open, setOpen] = useAtom(cmdkOpenAtom);

  React.useEffect(() => {
    if (!open) {
      setParentId(null);
    }
  }, [open, setParentId]);

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Type a command or search..."
          value={inputValue}
          onValueChange={setInputValue}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {commandsList.map((command, commandIndex) => {
            return (
              <CommandItem
                key={`${commandIndex} - ${command.name}`}
                value={command.name}
                onSelect={() => {
                  command.onSelect?.();
                  if (command.onSelect) {
                    setOpen(false);
                  } else {
                    setParentId(command.id);
                  }
                }}
              >
                {command.name.split(HIERARCHY_SEPARATOR).map((part, index) => {
                  return (
                    <span key={index} className="flex items-center gap-2">
                      {part}
                      {index <
                        command.name.split(HIERARCHY_SEPARATOR).length - 1 && (
                        <ChevronRight />
                      )}
                    </span>
                  );
                })}
              </CommandItem>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}
