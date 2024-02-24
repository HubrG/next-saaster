"use client";
type PriceCardBottomSentenceProps = {
  sentence: string;
  className?:string;
};

export const PriceCardBottomSentence = ({
  sentence,
  className
}: PriceCardBottomSentenceProps) => {
  return <p className={`${className} `}>{sentence}</p>;
};
