type Props = {
  className?: string;
};
export const Goodline = ({ className }: Props) => {
  return (
    <div
      className={`${className} my-5 h-auto w-full relative dark:opacity-100 opacity-50`}>
      {/* Gradients ajustés pour couvrir toute la largeur */}
      <div className="absolute top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-theming-text-200 to-transparent blur-sm" />
      <div className="absolute top-0 h-px w-full bg-gradient-to-r from-transparent via-theming-text-500 to-transparent" />
      <div className="absolute top-0 h-[5px] w-full bg-gradient-to-r from-transparent via-theming-text-foreground-500/50 to-transparent blur-sm" />
      <div className="absolute top-0 h-px w-full bg-gradient-to-r from-transparent via-theming-text-foreground-500/50 to-transparent" />
      <div className="absolute inset-0 w-full h-full [mask-image:radial-gradient(450px_200px_at_top,transparent_50%,white)]"></div>
    </div>
  );
};

export const GoodlineSecond = ({ className }: Props) => {
  return (
    <div
      className={`${className} my-5 h-auto w-full relative dark:opacity-100 opacity-50`}>
      {/* Gradients ajustés pour couvrir toute la largeur */}
      <div className="absolute top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-theming-text-200-second to-transparent blur-sm" />
      <div className="absolute top-0 h-px w-full bg-gradient-to-r from-transparent via-theming-text-500-second to-transparent" />
      <div className="absolute top-0 h-[5px] w-full bg-gradient-to-r from-transparent via-theming-text-foreground-500-second/50 to-transparent blur-sm" />
      <div className="absolute top-0 h-px w-full bg-gradient-to-r from-transparent via-theming-text-foreground-500-second/50 to-transparent" />
      <div className="absolute inset-0 w-full h-full [mask-image:radial-gradient(450px_200px_at_top,transparent_50%,white)]"></div>
    </div>
  );
};
