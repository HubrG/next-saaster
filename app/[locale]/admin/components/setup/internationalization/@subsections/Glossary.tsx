"use client";
import { SimpleLoader } from "@/src/components/ui/@fairysaas/loader";
import { PopoverDelete } from "@/src/components/ui/@fairysaas/popover-delete";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { useInternationalizationStore } from "@/src/stores/internationalizationStore";
import { InternationalizationDictionary } from "@prisma/client";
import { random } from "lodash";
import { Check, ShieldOff } from "lucide-react";
import { useState } from "react";
import { Tooltip } from "react-tooltip";

export const Glossary = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { dictionaries, setDictionaries, addDictionaryToStore } =
    useInternationalizationStore();

  const handleAddWord = async () => {
    setLoading(true);
    const dictionariesLength = dictionaries.length;
    const newWord = "Word-" + dictionariesLength + 1 + `${random(0, 9)}`;
    const add = await addDictionaryToStore(newWord);

    setLoading(false);
    return toaster({
      type: "success",
      description: `« ${newWord} » word added successfully.`,
    });
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className=" !py-0 w-full !mt-5"
            data-tooltip-id="manage-glossary-tt">
            <ShieldOff className="cursor-pointer icon !mr-2" /> Prevent certain
            words from being translated by the Deepl automatic translator
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 max-h-[50vh] overflow-auto">
          <div className="grid">
            {dictionaries.slice().map((dictionary) => (
              <div className="mb-2 py-1">
                <GlossaryCard dictionary={dictionary} />
              </div>
            ))}

            <Button onClick={handleAddWord}>
              {loading && <SimpleLoader />} Add a blacklist word
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <Tooltip
        opacity={1}
        id="manage-glossary-tt"
        className="tooltip"
        place="top">
        Gérer le glossaire
      </Tooltip>
    </>
  );
};

type Props = {
  dictionary: InternationalizationDictionary;
};

export const GlossaryCard = ({ dictionary }: Props) => {
  const [data, setData] = useState<string>(dictionary.word ?? "");
  const [loading, setLoading] = useState<boolean>(false);
  const {
    dictionaries,
    setDictionaries,
    updateDictionaryInStore,
    removeDictionaryFromStore,
  } = useInternationalizationStore();
  const initialDictionaryState = { ...dictionary };

  const handleDelete = async () => {
    setLoading(true);
    await removeDictionaryFromStore(dictionary.word);
    setLoading(false);
    setDictionaries(dictionaries.filter((dict) => dict.id !== dictionary.id));
    return toaster({
      description: `« ${dictionary.word} » supprimé avec succès.`,
      type: "success",
      duration: 8000,
    });
  };

  const handleSave = async () => {
    if (data === "") {
      return toaster({
        type: "error",
        description: `Veuillez entrer un mot`,
      });
    }
    setLoading(true);
    await updateDictionaryInStore(dictionary.id, data);
    setLoading(false);
    setDictionaries(
      dictionaries.map((dict) =>
        dict.id === dictionary.id ? { ...dict, word: data } : dict
      )
    );
    return toaster({
      type: "success",
      description: `Mot « ${initialDictionaryState.word} » mis à jour avec succès`,
    });
  };

  return (
    <>
      <div className="grid grid-cols-12 place-items-center gap-2 gap-y-0 !mb-0">
        <div className="col-span-8">
          <Input
            onChange={(e) => {
              setData(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave();
              }
            }}
            value={data}
          />
        </div>
        <div className="col-span-2">
          <Button
            size={"icon"}
            onClick={handleSave}
            data-tooltip-id={`${dictionary.id}tt-save-button`}>
            {loading ? (
              <SimpleLoader className="icon" />
            ) : (
              <Check className="icon" />
            )}
            <Tooltip
              className="tooltip"
              opacity={100}
              id={`${dictionary.id}tt-save-button`}
              place="top">
              Enregistrer
            </Tooltip>
          </Button>
        </div>
        <div className="col-span-2">
          <PopoverDelete
            what="ce mot"
            size="icon"
            handleDelete={handleDelete}
          />
        </div>
      </div>
    </>
  );
};
